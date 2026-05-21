import { Injectable } from '@angular/core';
import { ArchitectureNode, Currency } from '../models/architecture.model';
import * as serviceCostModelData from '../data/service-cost-model.json';

export interface CostBreakdownLine {
  label: string;
  formula: string;
  value: number;
  note?: string;
}

export interface CostBreakdown {
  lines: CostBreakdownLine[];
  total: number;
  freeTierNote?: string;
}

@Injectable({ providedIn: 'root' })
export class CostService {
  private readonly conversionRates: Record<Currency, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.0,
    JPY: 150.0
  };

  private readonly currencySymbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥'
  };

  private readonly costModel = (serviceCostModelData as any).serviceCostModel || {};

  getCurrencySymbol(currency: Currency): string {
    return this.currencySymbols[currency];
  }

  calculateTotalMonthlyCost(nodes: ArchitectureNode[], currency: Currency = 'USD'): number {
    const totalUsd = nodes.reduce((sum, node) => sum + this.calculateNodeCostUsd(node), 0);
    return totalUsd * this.conversionRates[currency];
  }

  getCostBreakdown(node: ArchitectureNode): CostBreakdown {
    const model = this.costModel[node.type];
    const config: any = node.config;
    const lines: CostBreakdownLine[] = [];
    let total = 0;
    let freeTierNote: string | undefined;

    if (model?.costEvaluation?.freeTier?.description) {
      freeTierNote = model.costEvaluation.freeTier.description;
    }

    switch (node.type) {
      case 'apiGateway': {
        const pf = model?.pricingFactors || {};
        const apiType = config.apiType || 'http';
        const reqM = config.requestCount || 10;
        const dataGB = config.responsePayloadGB || 0;
        const cacheEnabled = config.cacheStrategy && config.cacheStrategy !== 'disabled';
        const cacheSize = config.cacheSize || '0.5';

        const pricePerM = apiType === 'rest' ? (pf.restApiPerMillion || 3.50) : apiType === 'websocket' ? (pf.wsMessagesPerMillion || 1.00) : (pf.httpApiPerMillion || 1.00);
        const requestCost = reqM * pricePerM;
        lines.push({ label: 'API Request Cost', formula: `${reqM}M × $${pricePerM.toFixed(2)}/M (${apiType.toUpperCase()})`, value: requestCost, note: 'Based on API type selected' });

        const freeGB = pf.dataTransferFreeGB || 100;
        const billableGB = Math.max(0, dataGB - freeGB);
        const dtCost = billableGB * (pf.dataTransferPerGB || 0.09);
        lines.push({ label: 'Data Transfer Out', formula: `max(0, ${dataGB} − ${freeGB} free) × $0.09/GB`, value: dtCost, note: `First ${freeGB} GB/mo free` });

        let cacheCost = 0;
        if (cacheEnabled && apiType === 'rest') {
          const hourlyRate = pf.cachePricePerHour?.[cacheSize] || 0.020;
          cacheCost = hourlyRate * 730;
          lines.push({ label: 'API Cache', formula: `$${hourlyRate.toFixed(3)}/hr × 730 hrs (${cacheSize} GB)`, value: cacheCost, note: 'REST API only' });
        }
        total = requestCost + dtCost + cacheCost;
        break;
      }

      case 'route53': {
        const pf = model?.pricingFactors || {};
        const zones = config.hostedZoneCount || 1;
        const queryM = config.dnsQueryVolume || 1;
        const hcCount = config.healthCheckCount || 0;
        const routingType = config.routingPolicyType || 'simple';
        const hcType = config.healthCheckType || 'basic';

        const zoneCost = Math.min(zones, 25) * (pf.hostedZonePriceFirst25 || 0.50) + Math.max(0, zones - 25) * (pf.hostedZonePriceAfter25 || 0.10);
        lines.push({ label: 'Hosted Zones', formula: `min(${zones}, 25) × $0.50 + max(0, ${zones} − 25) × $0.10`, value: zoneCost });

        const queryPriceMap: Record<string, number> = {
          simple: pf.standardQueryPerMillion || 0.40,
          weighted: pf.latencyQueryPerMillion || 0.60,
          latency: pf.latencyQueryPerMillion || 0.60,
          failover: pf.latencyQueryPerMillion || 0.60,
          geolocation: pf.geoQueryPerMillion || 0.70,
          geoproximity: pf.geoQueryPerMillion || 0.70,
          ipBased: pf.ipBasedQueryPerMillion || 0.80,
          multivalue: pf.standardQueryPerMillion || 0.40
        };
        const qPrice = queryPriceMap[routingType] || 0.40;
        const queryCost = queryM * qPrice;
        lines.push({ label: 'DNS Query Cost', formula: `${queryM}M × $${qPrice.toFixed(2)}/M (${routingType})`, value: queryCost });

        const freeHC = pf.freeHealthChecks || 50;
        const billableHC = Math.max(0, hcCount - freeHC);
        const hcPriceMap: Record<string, number> = { basic: 0.50, https: 1.50, stringMatch: 2.50, httpsStringMatch: 3.50 };
        const hcUnitPrice = hcPriceMap[hcType] || 0.50;
        const hcCost = billableHC * hcUnitPrice;
        lines.push({ label: 'Health Checks', formula: `max(0, ${hcCount} − ${freeHC} free) × $${hcUnitPrice.toFixed(2)}/check`, value: hcCost, note: `First ${freeHC} AWS endpoint checks free` });

        total = zoneCost + queryCost + hcCost;
        break;
      }

      case 'cloudfront': {
        const pf = model?.pricingFactors || {};
        const reqM = config.viewerRequestCount || 10;
        const protocol = config.requestProtocol || 'https';
        const egressGB = config.viewerEgressGB || 100;
        const originShield = config.originShieldEnabled || false;
        const invalidations = config.invalidationPathCount || 0;

        const freeGB = pf.freeTransferGB || 1000;
        const billableGB = Math.max(0, egressGB - freeGB);
        const dtCost = billableGB * 0.085;
        lines.push({ label: 'Data Transfer Out', formula: `max(0, ${egressGB} − ${freeGB} free) × $0.085/GB`, value: dtCost, note: '1 TB/mo always free' });

        const pricePer10K = protocol === 'http' ? (pf.httpRequestPer10K || 0.0075) : (pf.httpsRequestPer10K || 0.0100);
        const totalReqs = reqM * 1_000_000;
        const freeReqs = pf.freeRequests || 10_000_000;
        const billableReqs = Math.max(0, totalReqs - freeReqs);
        const reqCost = (billableReqs / 10000) * pricePer10K;
        lines.push({ label: 'Request Cost', formula: `max(0, ${reqM}M − ${(freeReqs/1_000_000).toFixed(0)}M free) × $${pricePer10K.toFixed(4)}/10K (${protocol.toUpperCase()})`, value: reqCost, note: '10M requests/mo always free' });

        let osCost = 0;
        if (originShield) {
          osCost = (totalReqs / 10000) * (pf.originShieldPer10K || 0.009);
          lines.push({ label: 'Origin Shield', formula: `${reqM}M requests × $0.009/10K`, value: osCost });
        }

        const freeInvalidations = pf.invalidationFree || 1000;
        const billableInv = Math.max(0, invalidations - freeInvalidations);
        const invCost = billableInv * (pf.invalidationPricePerPath || 0.005);
        if (invalidations > 0) {
          lines.push({ label: 'Invalidations', formula: `max(0, ${invalidations} − ${freeInvalidations} free) × $0.005`, value: invCost });
        }

        total = dtCost + reqCost + osCost + invCost;
        break;
      }

      case 'lambda': {
        const pf = model?.pricingFactors || {};
        const invocM = config.invocationCount || 10;
        const durationMs = config.avgDurationMs || 250;
        const memMB = config.memoryMB || config.memory || 512;
        const arch = config.architecture || 'arm64';
        const provisioned = config.provisionedConcurrency || 0;
        const storageMB = config.ephemeralStorageMB || 512;

        const reqPrice = pf.requestPerMillion || 0.20;
        const freeReqs = (pf.freeRequests || 1_000_000) / 1_000_000;
        const billableReqM = Math.max(0, invocM - freeReqs);
        const reqCost = billableReqM * reqPrice;
        lines.push({ label: 'Request Cost', formula: `max(0, ${invocM}M − ${freeReqs}M free) × $${reqPrice.toFixed(2)}/M`, value: reqCost, note: '1M requests/mo always free' });

        const gbSecPrice = arch === 'arm64' ? (pf.armGbSecondPrice || 0.0000133334) : (pf.x86GbSecondPrice || 0.0000166667);
        const totalInvocations = invocM * 1_000_000;
        const gbSeconds = totalInvocations * (durationMs / 1000) * (memMB / 1024);
        const freeGBSec = pf.freeGBSeconds || 400000;
        const billableGBSec = Math.max(0, gbSeconds - freeGBSec);
        const computeCost = billableGBSec * gbSecPrice;
        lines.push({ label: 'Compute (GB-seconds)', formula: `${(gbSeconds / 1000).toFixed(1)}K GB-sec × $${gbSecPrice.toFixed(10)}/GB-sec (${arch})`, value: computeCost, note: `400K GB-sec/mo free. Arch: ${arch}` });

        let provCost = 0;
        if (provisioned > 0) {
          const provGBSec = provisioned * (memMB / 1024) * 30 * 24 * 3600;
          provCost = provGBSec * (pf.provisionedCapacityPerGBSec || 0.0000041667);
          lines.push({ label: 'Provisioned Concurrency', formula: `${provisioned} instances × ${(memMB / 1024).toFixed(2)} GB × 2.59M sec × $0.0000041667/GB-sec`, value: provCost, note: 'Billed 24/7 even when idle' });
        }

        let storageCost = 0;
        if (storageMB > 512) {
          const extraGB = (storageMB - 512) / 1024;
          storageCost = extraGB * gbSeconds * (pf.ephemeralStoragePerGBSec || 0.0000000309);
          lines.push({ label: 'Ephemeral Storage', formula: `${extraGB.toFixed(2)} GB × ${(gbSeconds / 1000).toFixed(1)}K sec × $0.0000000309/GB-sec`, value: storageCost, note: '512 MB included free' });
        }

        total = reqCost + computeCost + provCost + storageCost;
        break;
      }

      case 'ec2': {
        const pf = model?.pricingFactors || {};
        const instType = config.instanceType || 't3.medium';
        const count = config.instanceCount || config.replication || 2;
        const hours = config.runHours || 730;
        const purchase = config.purchaseOption || config.purchaseModel || 'on-demand';
        const volType = config.ebsVolumeType || 'gp3';
        const volGB = config.ebsVolumeGB || 100;
        const iops = config.ebsIOPS || 3000;
        const dtOutGB = config.dataTransferOutGB || 50;

        const hourly = pf.instancePricing?.[instType] || 0.0416;
        const discountMap: Record<string, number> = { 'on-demand': 0, 'spot': 0.70, 'reserved-1yr': 0.40, 'reserved-3yr': 0.60, 'savings-plan': 0.66 };
        const discount = discountMap[purchase] || 0;
        const computeCost = count * hourly * hours * (1 - discount);
        lines.push({ label: 'Compute', formula: `${count} × $${hourly.toFixed(4)}/hr × ${hours} hrs × ${((1 - discount) * 100).toFixed(0)}%`, value: computeCost, note: `${instType} (${purchase})` });

        const ebsPrice = pf.ebsPricing?.[volType] || 0.08;
        const storageCost = count * volGB * ebsPrice;
        lines.push({ label: 'EBS Storage', formula: `${count} × ${volGB} GB × $${ebsPrice.toFixed(3)}/GB (${volType})`, value: storageCost });

        let iopsCost = 0;
        if (volType === 'gp3') {
          const extraIOPS = Math.max(0, iops - (pf.gp3FreeIOPS || 3000));
          iopsCost = count * extraIOPS * (pf.gp3ExtraIOPSPrice || 0.005);
          if (extraIOPS > 0) {
            lines.push({ label: 'Extra IOPS (gp3)', formula: `${count} × ${extraIOPS} IOPS × $0.005/IOPS`, value: iopsCost, note: '3,000 IOPS included with gp3' });
          }
        } else {
          iopsCost = count * iops * (pf.io1IOPSPrice || 0.065);
          lines.push({ label: 'Provisioned IOPS', formula: `${count} × ${iops} IOPS × $0.065/IOPS`, value: iopsCost });
        }

        const freeGB = pf.dataTransferFreeGB || 100;
        const billableTransfer = Math.max(0, dtOutGB - freeGB);
        const dtCost = billableTransfer * (pf.dataTransferPerGB || 0.09);
        lines.push({ label: 'Data Transfer Out', formula: `max(0, ${dtOutGB} − ${freeGB} free) × $0.09/GB`, value: dtCost });

        total = computeCost + storageCost + iopsCost + dtCost;
        break;
      }

      case 's3': {
        const pf = model?.pricingFactors || {};
        const sClass = config.storageClass || 'standard';
        const storedGB = config.storedGB || config.storageSize || 1000;
        const putK = config.putRequestCount || 100;
        const getK = config.getRequestCount || 1000;
        const dtOutGB = config.dataTransferOutGB || config.dataTransferOut || 100;

        const storagePrice = pf.storagePerGB?.[sClass] || 0.023;
        const storageCost = storedGB * storagePrice;
        lines.push({ label: 'Storage', formula: `${storedGB} GB × $${storagePrice.toFixed(4)}/GB (${sClass})`, value: storageCost });

        const putPrice = pf.putPer1K?.[sClass] || 0.005;
        const putCost = putK * putPrice;
        lines.push({ label: 'PUT/COPY/POST/LIST', formula: `${putK}K requests × $${putPrice.toFixed(4)}/1K`, value: putCost });

        const getPrice = pf.getPer1K?.[sClass] || 0.0004;
        const getCost = getK * getPrice;
        lines.push({ label: 'GET/SELECT', formula: `${getK}K requests × $${getPrice.toFixed(4)}/1K`, value: getCost });

        const freeGB = pf.dataTransferFreeGB || 100;
        const billableTransfer = Math.max(0, dtOutGB - freeGB);
        const dtCost = billableTransfer * (pf.dataTransferPerGB || 0.09);
        lines.push({ label: 'Data Transfer Out', formula: `max(0, ${dtOutGB} − ${freeGB} free) × $0.09/GB`, value: dtCost });

        total = storageCost + putCost + getCost + dtCost;
        break;
      }

      case 'alb': {
        const pf = model?.pricingFactors || {};
        const instances = config.instanceCount || 1;
        const lcus = config.lcuCount || 1;
        const hourlyRate = pf.hourly || 0.0225;
        const lcuRate = pf.lcu || 0.008;
        const hourlyCost = instances * 730 * hourlyRate;
        lines.push({ label: 'Hourly Charge', formula: `${instances} instances × 730 hrs × $${hourlyRate.toFixed(4)}/hr`, value: hourlyCost });
        const lcuCost = lcus * 730 * lcuRate;
        lines.push({ label: 'LCU Charge', formula: `${lcus} LCUs × 730 hrs × $${lcuRate.toFixed(3)}/LCU`, value: lcuCost });
        total = hourlyCost + lcuCost;
        break;
      }
      case 'vpc': {
        const pf = model?.pricingFactors || {};
        const endpoints = config.endpoints || 0;
        const endpointGB = config.endpointGB || 0;
        const peeringGB = config.peeringGB || 0;
        const epHourlyCost = endpoints * 730 * (pf.endpointHourly || 0.01);
        if (endpoints > 0) lines.push({ label: 'Endpoint Hourly', formula: `${endpoints} endpoints × 730 hrs × $0.01/hr`, value: epHourlyCost });
        const epDataCost = endpointGB * (pf.endpointGB || 0.01);
        if (endpointGB > 0) lines.push({ label: 'Endpoint Data', formula: `${endpointGB} GB × $0.01/GB`, value: epDataCost });
        const peeringCost = peeringGB * (pf.peeringGB || 0.02);
        if (peeringGB > 0) lines.push({ label: 'Peering Data', formula: `${peeringGB} GB × $0.02/GB`, value: peeringCost });
        total = epHourlyCost + epDataCost + peeringCost;
        break;
      }
      case 'natGateway': {
        const pf = model?.pricingFactors || {};
        const instances = config.instances || 1;
        const dataGB = config.dataGB || 100;
        const hourlyCost = instances * 730 * (pf.hourly || 0.045);
        lines.push({ label: 'Hourly Charge', formula: `${instances} NATs × 730 hrs × $0.045/hr`, value: hourlyCost });
        const dataCost = dataGB * (pf.perGB || 0.045);
        lines.push({ label: 'Data Processing', formula: `${dataGB} GB × $0.045/GB`, value: dataCost });
        total = hourlyCost + dataCost;
        break;
      }
      case 'cloudWatch': {
        const pf = model?.pricingFactors || {};
        const metrics = config.customMetrics || 10;
        const logs = config.logsGB || 50;
        const alarms = config.alarms || 5;
        const dashboards = config.dashboards || 1;
        const metricsCost = metrics * (pf.metric || 0.30);
        if (metrics > 0) lines.push({ label: 'Custom Metrics', formula: `${metrics} metrics × $0.30/metric`, value: metricsCost });
        const logsCost = logs * (pf.logsGB || 0.50);
        if (logs > 0) lines.push({ label: 'Log Ingestion', formula: `${logs} GB × $0.50/GB`, value: logsCost });
        const alarmsCost = alarms * (pf.alarm || 0.10);
        if (alarms > 0) lines.push({ label: 'Alarms', formula: `${alarms} alarms × $0.10/alarm`, value: alarmsCost });
        const billableDashboards = Math.max(0, dashboards - (pf.freeDashboards || 3));
        const dashCost = billableDashboards * (pf.dashboard || 3.00);
        if (dashboards > 0) lines.push({ label: 'Dashboards', formula: `max(0, ${dashboards} − 3 free) × $3.00`, value: dashCost });
        total = metricsCost + logsCost + alarmsCost + dashCost;
        break;
      }
      case 'dynamoDb': {
        const pf = model?.pricingFactors || {};
        const mode = config.capacityMode || 'provisioned';
        const wcu = config.wcu || 100;
        const rcu = config.rcu || 100;
        const wru = config.wruM || 1;
        const rru = config.rruM || 1;
        const storage = config.storageGB || 10;
        let capCost = 0;
        if (mode === 'provisioned') {
          const wcuCost = wcu * 730 * (pf.wcuHour || 0.00065);
          lines.push({ label: 'Provisioned Writes', formula: `${wcu} WCU × 730 hrs × $0.00065/hr`, value: wcuCost });
          const rcuCost = rcu * 730 * (pf.rcuHour || 0.00013);
          lines.push({ label: 'Provisioned Reads', formula: `${rcu} RCU × 730 hrs × $0.00013/hr`, value: rcuCost });
          capCost = wcuCost + rcuCost;
        } else {
          const wruCost = wru * (pf.wruMillion || 1.25);
          lines.push({ label: 'On-Demand Writes', formula: `${wru}M requests × $1.25/M`, value: wruCost });
          const rruCost = rru * (pf.rruMillion || 0.25);
          lines.push({ label: 'On-Demand Reads', formula: `${rru}M requests × $0.25/M`, value: rruCost });
          capCost = wruCost + rruCost;
        }
        const billableStorage = Math.max(0, storage - (pf.freeStorageGB || 25));
        const storageCost = billableStorage * (pf.storageGB || 0.25);
        lines.push({ label: 'Storage', formula: `max(0, ${storage} − 25 free) × $0.25/GB`, value: storageCost });
        total = capCost + storageCost;
        break;
      }
      case 'rds': {
        const pf = model?.pricingFactors || {};
        const type = config.instanceType || 'db.t3.medium';
        const multi = config.multiAZ || false;
        const storage = config.storageGB || 100;
        const multiplier = multi ? 2 : 1;
        const hourly = (pf.instances && pf.instances[type]) ? pf.instances[type] : 0.068;
        const computeCost = hourly * 730 * multiplier;
        lines.push({ label: 'DB Compute', formula: `$${hourly}/hr × 730 hrs × ${multiplier}`, value: computeCost, note: `${type} ${multi ? '(Multi-AZ)' : ''}` });
        const storageCost = storage * (pf.storageGB || 0.115) * multiplier;
        lines.push({ label: 'DB Storage (gp3)', formula: `${storage} GB × $0.115/GB × ${multiplier}`, value: storageCost });
        total = computeCost + storageCost;
        break;
      }
      case 'elastiCache': {
        const pf = model?.pricingFactors || {};
        const type = config.instanceType || 'cache.t3.medium';
        const nodes = config.nodes || 2;
        const backup = config.backupGB || 0;
        const hourly = (pf.instances && pf.instances[type]) ? pf.instances[type] : 0.068;
        const computeCost = nodes * hourly * 730;
        lines.push({ label: 'Node Compute', formula: `${nodes} nodes × $${hourly}/hr × 730 hrs`, value: computeCost, note: type });
        const backupCost = backup * (pf.backupGB || 0.085);
        if (backup > 0) lines.push({ label: 'Backup Storage', formula: `${backup} GB × $0.085/GB`, value: backupCost });
        total = computeCost + backupCost;
        break;
      }
      case 'ecs':
      case 'batch': {
        const pf = model?.pricingFactors || {};
        const tasks = config.tasks || (node.type === 'ecs' ? 2 : 1);
        const vcpu = Number(config.vCPU) || (node.type === 'ecs' ? 0.5 : 2);
        const mem = config.memoryGB || (node.type === 'ecs' ? 1 : 4);
        const hrs = node.type === 'batch' ? (config.hoursPerMonth || 100) : 730;
        const lbl = node.type === 'batch' ? 'jobs' : 'tasks';
        const cpuCost = tasks * vcpu * hrs * (pf.cpuHour || 0.04048);
        lines.push({ label: 'vCPU Cost', formula: `${tasks} ${lbl} × ${vcpu} vCPU × ${hrs} hrs × $0.04048/hr`, value: cpuCost });
        const memCost = tasks * mem * hrs * (pf.memHour || 0.004445);
        lines.push({ label: 'Memory Cost', formula: `${tasks} ${lbl} × ${mem} GB × ${hrs} hrs × $0.004445/hr`, value: memCost });
        total = cpuCost + memCost;
        break;
      }
      case 'sqs': {
        const pf = model?.pricingFactors || {};
        const type = config.queueType || 'standard';
        const reqs = config.requestsM || 10;
        const rate = type === 'fifo' ? (pf.fifo || 0.50) : (pf.standard || 0.40);
        const reqCost = reqs * rate;
        lines.push({ label: 'Requests Cost', formula: `${reqs}M × $${rate.toFixed(2)}/M`, value: reqCost, note: type });
        total = reqCost;
        break;
      }
      case 'sns': {
        const pf = model?.pricingFactors || {};
        const pub = config.publishM || 10;
        const http = config.httpDeliveriesM || 10;
        const email = config.emailDeliveriesM || 0;
        const pubCost = pub * (pf.publish || 0.50);
        if (pub > 0) lines.push({ label: 'Publish Cost', formula: `${pub}M × $0.50/M`, value: pubCost });
        const httpCost = http * (pf.http || 0.60);
        if (http > 0) lines.push({ label: 'HTTP Delivery', formula: `${http}M × $0.60/M`, value: httpCost });
        const emailCost = email * (pf.email || 20.00);
        if (email > 0) lines.push({ label: 'Email Delivery', formula: `${email}M × $20.00/M`, value: emailCost });
        total = pubCost + httpCost + emailCost;
        break;
      }
      case 'stepFunctions': {
        const pf = model?.pricingFactors || {};
        const type = config.workflowType || 'standard';
        if (type === 'standard') {
          const trans = config.transitionsM || 1;
          const cost = trans * (pf.standard || 25.00);
          lines.push({ label: 'Standard Transitions', formula: `${trans}M × $25.00/M`, value: cost });
          total = cost;
        } else {
          const reqs = config.expressRequestsM || 0;
          const gb = config.expressGBsecM || 0;
          const reqCost = reqs * (pf.expressReq || 1.00);
          if (reqs > 0) lines.push({ label: 'Express Requests', formula: `${reqs}M × $1.00/M`, value: reqCost });
          const compCost = gb * (pf.expressGBsec || 16.67);
          if (gb > 0) lines.push({ label: 'Express Compute', formula: `${gb}M GB-sec × $16.67/M`, value: compCost });
          total = reqCost + compCost;
        }
        break;
      }
      case 'iam':
      case 'securityGroup':
      case 'client':
      case 'autoScalingGroup': {
        total = 0;
        break;
      }

    }

    return { lines, total: Math.max(0, total), freeTierNote };
  }

  calculateNodeCostUsd(node: ArchitectureNode): number {
    return this.getCostBreakdown(node).total;
  }
}
