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
  public readonly regions = [
    { code: 'us-east-1', name: 'US East (N. Virginia)', multiplier: 1.00 },
    { code: 'us-east-2', name: 'US East (Ohio)', multiplier: 1.00 },
    { code: 'us-west-1', name: 'US West (N. California)', multiplier: 1.10 },
    { code: 'us-west-2', name: 'US West (Oregon)', multiplier: 1.02 },
    { code: 'ca-central-1', name: 'Canada (Central)', multiplier: 1.05 },
    { code: 'eu-west-1', name: 'Europe (Ireland)', multiplier: 1.08 },
    { code: 'eu-west-2', name: 'Europe (London)', multiplier: 1.10 },
    { code: 'eu-west-3', name: 'Europe (Paris)', multiplier: 1.12 },
    { code: 'eu-central-1', name: 'Europe (Frankfurt)', multiplier: 1.12 },
    { code: 'eu-central-2', name: 'Europe (Zurich)', multiplier: 1.16 },
    { code: 'eu-north-1', name: 'Europe (Stockholm)', multiplier: 1.05 },
    { code: 'eu-south-1', name: 'Europe (Milan)', multiplier: 1.15 },
    { code: 'eu-south-2', name: 'Europe (Spain)', multiplier: 1.15 },
    { code: 'ap-east-1', name: 'Asia Pacific (Hong Kong)', multiplier: 1.18 },
    { code: 'ap-south-1', name: 'Asia Pacific (Mumbai)', multiplier: 1.12 },
    { code: 'ap-south-2', name: 'Asia Pacific (Hyderabad)', multiplier: 1.12 },
    { code: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', multiplier: 1.15 },
    { code: 'ap-northeast-2', name: 'Asia Pacific (Seoul)', multiplier: 1.12 },
    { code: 'ap-northeast-3', name: 'Asia Pacific (Osaka)', multiplier: 1.15 },
    { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', multiplier: 1.15 },
    { code: 'ap-southeast-2', name: 'Asia Pacific (Sydney)', multiplier: 1.18 },
    { code: 'ap-southeast-3', name: 'Asia Pacific (Jakarta)', multiplier: 1.20 },
    { code: 'ap-southeast-4', name: 'Asia Pacific (Melbourne)', multiplier: 1.20 },
    { code: 'me-south-1', name: 'Middle East (Bahrain)', multiplier: 1.18 },
    { code: 'me-central-1', name: 'Middle East (UAE)', multiplier: 1.18 },
    { code: 'sa-east-1', name: 'South America (São Paulo)', multiplier: 1.38 },
    { code: 'af-south-1', name: 'Africa (Cape Town)', multiplier: 1.18 }
  ];

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

  calculateTotalMonthlyCost(nodes: ArchitectureNode[], currency: Currency = 'USD', region: string = 'us-east-1'): number {
    const totalUsd = nodes.reduce((sum, node) => sum + this.calculateNodeCostUsd(node, region), 0);
    return totalUsd * this.conversionRates[currency];
  }

  getCostBreakdown(node: ArchitectureNode, region: string = 'us-east-1'): CostBreakdown {
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
        const type = config.type || 'rest';
        const reqsM = config.requestsM || 10;
        const reqRate = pf.requestsM?.[type] || 3.50;
        const reqCost = reqsM * reqRate;
        lines.push({ label: type.toUpperCase() + ' API Requests', formula: reqsM + 'M × $' + reqRate.toFixed(2) + '/M', value: reqCost });
        let cacheCost = 0;
        if (type === 'rest' && config.cacheGB && config.cacheGB !== '0') {
           cacheCost = pf.cacheRates?.[config.cacheGB] || 14.0;
           lines.push({ label: 'Dedicated Cache', formula: config.cacheGB + ' GB Tier', value: cacheCost });
        }
        total = reqCost + cacheCost;

        break;
      }

      case 'route53': {
        const pf = model?.pricingFactors || {};
        const zones = config.hostedZones || 1;
        const zoneCost = zones * (pf.zoneMonthly || 0.50);
        lines.push({ label: 'Hosted Zones', formula: zones + ' Zones × $0.50/mo', value: zoneCost });
        const stdM = config.queriesM || 10;
        const stdCost = stdM * (pf.standardM || 0.40);
        if (stdCost > 0) lines.push({ label: 'Standard Queries', formula: stdM + 'M × $0.40/M', value: stdCost });
        const latM = config.latencyQueriesM || 0;
        const latCost = latM * (pf.latencyM || 0.60);
        if (latCost > 0) lines.push({ label: 'Latency Queries', formula: latM + 'M × $0.60/M', value: latCost });
        total = zoneCost + stdCost + latCost;

        break;
      }

      case 'cloudfront': {
        const pf = model?.pricingFactors || {};
        const region = config.region || 'us-eu';
        const dtOut = config.dataTransferOut || 1000;
        const dtRate = pf.dtOut?.[region] || 0.085;
        const dtCost = dtOut * dtRate;
        lines.push({ label: 'Data Transfer Out', formula: dtOut + ' GB × $' + dtRate + '/GB', value: dtCost });
        const reqsM = config.requestsM || 10;
        const reqRate = pf.requestsM?.[region] || 1.0;
        const reqCost = reqsM * reqRate;
        lines.push({ label: 'Requests', formula: reqsM + 'M × $' + reqRate + '/M', value: reqCost });
        let wafCost = 0;
        if (config.wafEnabled) {
           wafCost = (pf.wafBase || 5.0) + (reqsM * (pf.wafRequestM || 0.60));
           lines.push({ label: 'WAF Integration', formula: '$5.00 + (' + reqsM + 'M × $0.60/M)', value: wafCost });
        }
        total = dtCost + reqCost + wafCost;

        break;
      }

      case 'lambda': {

        const pf = model?.pricingFactors || {};
        const isArm = config.architecture === 'arm64';
        const memoryMB = config.memoryMB || 512;
        const invocationsM = config.invocationsM || 10;
        const durationMs = config.durationMs || 200;
        
        const reqCost = invocationsM * (pf.requestM || 0.20);
        lines.push({ label: 'Requests', formula: `${invocationsM}M × $0.20/M`, value: reqCost });
        
        const gbSec = invocationsM * 1000000 * (durationMs / 1000) * (memoryMB / 1024);
        const compRate = isArm ? (pf.gbSec_arm || 0.0000133334) : (pf.gbSec_x86 || 0.0000166667);
        const compCost = gbSec * compRate;
        lines.push({ label: `Compute (${isArm ? 'ARM' : 'x86'})`, formula: `${gbSec.toLocaleString(undefined, {maximumFractionDigits:0})} GB-sec × $${compRate.toFixed(6)}/GB-sec`, value: compCost });
        
        let ephCost = 0;
        const ephMB = config.ephemeralMB || 512;
        if (ephMB > 512) {
           const ephGB = (ephMB - 512) / 1024;
           ephCost = invocationsM * 1000000 * (durationMs / 1000) * ephGB * (pf.ephemeralGB_Sec || 0.0000000309);
           lines.push({ label: 'Ephemeral Storage', formula: `${ephGB.toFixed(2)} extra GB × $${(pf.ephemeralGB_Sec || 0.0000000309).toFixed(10)}/GB-sec`, value: ephCost });
        }
        
        let provCost = 0;
        const provConcurrency = config.provConcurrency || 0;
        if (provConcurrency > 0) {
           const provRate = isArm ? (pf.provConcurrency_arm || 0.012) : (pf.provConcurrency_x86 || 0.015);
           provCost = provConcurrency * (memoryMB / 1024) * 730 * provRate;
           lines.push({ label: 'Provisioned Concurrency', formula: `${provConcurrency} Concurrency × ${(memoryMB/1024).toFixed(2)} GB × 730 hrs × $${provRate.toFixed(3)}`, value: provCost });
        }
        
        total = reqCost + compCost + ephCost + provCost;

        break;
      }

      case 'ec2': {

        const pf = model?.pricingFactors || {};
        const count = config.count || 2;
        const family = config.instanceFamily || 't3';
        const size = config.instanceSize || 'medium';
        const baseRate = pf.familyRatesLarge?.[family] || 0.096;
        const multiplier = pf.sizeMultipliers?.[size] || 0.5;
        const hourlyRate = baseRate * multiplier;
        
        const purchase = config.purchaseOption || 'on-demand';
        const discount = pf.purchaseDiscounts?.[purchase] || 0;
        const finalRate = hourlyRate * (1 - discount);
        
        const computeCost = count * finalRate * 730;
        lines.push({ label: `EC2 Compute (${family}.${size})`, formula: `${count} Nodes × $${hourlyRate.toFixed(4)}/hr × 730 hrs × ${((1-discount)*100).toFixed(0)}% rate`, value: computeCost });
        
        const storageType = config.storageType || 'gp3';
        const storageSize = config.storageSize || 30;
        const storageRate = pf.ebsRates?.[storageType] || 0.08;
        const ebsCost = count * storageSize * storageRate;
        lines.push({ label: `EBS Storage (${storageType})`, formula: `${count} Nodes × ${storageSize} GB × $${storageRate.toFixed(3)}/GB`, value: ebsCost });
        
        const dto = config.dataTransferOut || 100;
        const dtoCost = dto * (pf.dataTransferGB || 0.09);
        if (dtoCost > 0) lines.push({ label: 'Data Transfer Out', formula: `${dto} GB × $0.09/GB`, value: dtoCost });
        
        total = computeCost + ebsCost + dtoCost;

        break;
      }

      case 's3': {
        const pf = model?.pricingFactors || {};
        const sClass = config.storageClass || 'standard';
        const sGB = config.storageGB || 100;
        const sRate = pf.storage?.[sClass] || 0.023;
        const storageCost = sGB * sRate;
        lines.push({ label: 'S3 Storage (' + sClass + ')', formula: sGB + ' GB × $' + sRate + '/GB', value: storageCost });
        const putsM = config.putsM || 1;
        const putRate = pf.puts?.[sClass] || 5.0;
        const putCost = putsM * putRate;
        if (putCost > 0) lines.push({ label: 'PUT Requests', formula: putsM + 'M × $' + putRate + '/M', value: putCost });
        const getsM = config.getsM || 10;
        const getRate = pf.gets?.[sClass] || 0.4;
        const getCost = getsM * getRate;
        if (getCost > 0) lines.push({ label: 'GET Requests', formula: getsM + 'M × $' + getRate + '/M', value: getCost });
        const dtOut = config.dataTransferOut || 100;
        const dtCost = dtOut * (pf.dataTransferGB || 0.09);
        if (dtCost > 0) lines.push({ label: 'Data Transfer Out', formula: dtOut + ' GB × $0.09/GB', value: dtCost });
        total = storageCost + putCost + getCost + dtCost;

        break;
      }

      case 'alb': {
        const pf = model?.pricingFactors || {};
        const count = config.count || 1;
        const hrCost = count * 730 * (pf.hourly || 0.0225);
        lines.push({ label: 'ALB Hourly Base', formula: count + ' ALBs × 730 hrs × $0.0225/hr', value: hrCost });
        const dataGB = config.dataGB || 100;
        const rulesM = config.rules || 0;
        const lcus = (dataGB / 100) + (rulesM * 0.1);
        const lcuCost = lcus * 730 * (pf.lcuHour || 0.008);
        if (lcuCost > 0) lines.push({ label: 'LCU Cost (Approx)', formula: '~' + lcus.toFixed(1) + ' LCUs × 730 hrs × $0.008/hr', value: lcuCost });
        total = hrCost + lcuCost;

        break;
      }
      case 'vpc': {
        const pf = model?.pricingFactors || {};
        const ep = config.endpoints || 0;
        const epCost = ep * 730 * (pf.endpointHourly || 0.01);
        if (epCost > 0) lines.push({ label: 'VPC Endpoints (Hourly)', formula: ep + ' endpoints × 730 hrs × $0.01/hr', value: epCost });
        const epGB = config.endpointGB || 0;
        const gbCost = epGB * (pf.endpointGB || 0.01);
        if (gbCost > 0) lines.push({ label: 'VPC Endpoint Data', formula: epGB + ' GB × $0.01/GB', value: gbCost });
        total = epCost + gbCost;

        break;
      }
      case 'natGateway': {
        const pf = model?.pricingFactors || {};
        const count = config.count || 1;
        const hrCost = count * 730 * (pf.hourly || 0.045);
        lines.push({ label: 'NAT Gateway Hourly', formula: count + ' NATs × 730 hrs × $0.045/hr', value: hrCost });
        const dataGB = config.dataGB || 100;
        const dataCost = dataGB * (pf.dataGB || 0.045);
        lines.push({ label: 'Data Processed', formula: dataGB + ' GB × $0.045/GB', value: dataCost });
        total = hrCost + dataCost;

        break;
      }
      case 'cloudWatch': {
        const pf = model?.pricingFactors || {}; const met = config.metrics || 100; const costMet = met * (pf.metricRate || 0.30); 
        lines.push({ label: 'Metrics', formula: met + ' Metrics × $0.30', value: costMet }); const gb = config.logsGB || 50; const costGb = gb * (pf.logsGB || 0.50); 
        lines.push({ label: 'Log Ingestion', formula: gb + ' GB × $0.50', value: costGb }); 
        total = costMet + costGb;
        break;
      }
      case 'dynamoDb': {

        const pf = model?.pricingFactors || {};
        const mode = config.capacityMode || 'on-demand';
        const sClass = config.storageClass || 'standard';
        const rates = pf[sClass === 'infrequent-access' ? 'ia' : 'std'] || pf.std;
        
        let computeCost = 0;
        if (mode === 'on-demand') {
           const readsM = config.readsM || 10;
           const writesM = config.writesM || 5;
           const readCost = readsM * rates.readM;
           lines.push({ label: 'Read Requests', formula: `${readsM}M × $${rates.readM}/M`, value: readCost });
           const writeCost = writesM * rates.writeM;
           lines.push({ label: 'Write Requests', formula: `${writesM}M × $${rates.writeM}/M`, value: writeCost });
           computeCost = readCost + writeCost;
        } else {
           const wcu = config.wcu || 100;
           const rcu = config.rcu || 100;
           const wCost = wcu * rates.wcuHr * 730;
           lines.push({ label: 'Provisioned WCU', formula: `${wcu} WCU × $${rates.wcuHr.toFixed(5)}/hr × 730 hrs`, value: wCost });
           const rCost = rcu * rates.rcuHr * 730;
           lines.push({ label: 'Provisioned RCU', formula: `${rcu} RCU × $${rates.rcuHr.toFixed(5)}/hr × 730 hrs`, value: rCost });
           computeCost = wCost + rCost;
        }
        
        const storageGB = config.storageGB || 50;
        const storageCost = storageGB * rates.storageGB;
        lines.push({ label: `Storage (${sClass})`, formula: `${storageGB} GB × $${rates.storageGB}/GB`, value: storageCost });
        
        total = computeCost + storageCost;
        
        if (config.globalTables) {
           const gMult = pf.globalMultiplier || 1.5;
           lines.push({ label: 'Global Tables Replication', formula: `Total × ${(gMult - 1)*100}% premium`, value: total * (gMult - 1) });
           total = total * gMult;
        }

        break;
      }
      case 'rds': {

        const pf = model?.pricingFactors || {};
        const engine = config.engine || 'postgresql';
        const instance = config.instanceClass || 'db.m5.large';
        const count = config.count || 2;
        
        const baseRate = pf.instances?.[instance] || 0.171;
        const engineMult = pf.engines?.[engine] || 1.0;
        const multiAzMult = config.multiAz ? (pf.multiAzMultiplier || 2.0) : 1.0;
        
        const computeCost = count * baseRate * engineMult * multiAzMult * 730;
        lines.push({ label: `RDS Compute (${instance})`, formula: `${count} Nodes × $${baseRate.toFixed(3)}/hr × ${engineMult} engine × ${multiAzMult} AZ × 730 hrs`, value: computeCost });
        
        const sType = config.storageType || 'gp3';
        const sGB = config.storageSize || 100;
        const sRate = pf.storage?.[sType] || 0.115;
        const storageCost = sGB * sRate;
        lines.push({ label: `Storage (${sType})`, formula: `${sGB} GB × $${sRate}/GB`, value: storageCost });
        
        const backupGB = config.backupStorage || 100;
        const bRate = pf.backupGB || 0.095;
        const backupCost = backupGB > sGB ? (backupGB - sGB) * bRate : 0; // usually get storage size free
        if (backupCost > 0) {
           lines.push({ label: 'Backup Storage', formula: `${backupGB - sGB} billed GB × $${bRate}/GB`, value: backupCost });
        }
        
        total = computeCost + storageCost + backupCost;

        break;
      }
      case 'elastiCache': {

        const pf = model?.pricingFactors || {};
        const count = config.count || 2;
        const nodeType = config.nodeType || 'cache.t3.medium';
        const rate = pf.instances?.[nodeType] || 0.068;
        
        let computeCost = count * rate * 730;
        let formulaStr = `${count} Nodes × $${rate}/hr × 730 hrs`;
        
        if (config.dataTiering) {
           const mult = pf.tieringPremium || 1.15;
           computeCost *= mult;
           formulaStr += ` × ${mult} tiering`;
        }
        
        lines.push({ label: `ElastiCache Compute (${nodeType})`, formula: formulaStr, value: computeCost });
        total = computeCost;

        break;
      }
      case 'ecs':
      case 'batch': {
        const pf = model?.pricingFactors || {};
        const isFargate = node.type === 'batch' || (config.launchType !== 'ec2');
        const hrs = node.type === 'batch' ? (config.hoursPerMonth || 100) : (config.runtimeHours || 730);
        const util = (config.utilization || 100) / 100;

        let computeCost = 0;
        if (isFargate) {
          const tasks = config.tasks || (node.type === 'ecs' ? 2 : 1);
          const vcpu = Number(config.vCPU) || (node.type === 'ecs' ? 0.5 : 2);
          const mem = config.memoryGB || (node.type === 'ecs' ? 1 : 4);
          const lbl = node.type === 'batch' ? 'jobs' : 'tasks';
          
          const isArm = config.architecture === 'arm';
          const cpuRate = isArm ? (pf.armCpuHour || 0.03238) : (pf.cpuHour || 0.04048);
          const memRate = isArm ? (pf.armMemHour || 0.00356) : (pf.memHour || 0.004445);
          
          let baseCpuCost = tasks * vcpu * hrs * cpuRate * util;
          let baseMemCost = tasks * mem * hrs * memRate * util;
          
          const spotUsage = (config.spotUsage || 0) / 100;
          const spotDiscount = pf.spotDiscount || 0.70;
          const blendedMultiplier = (1 - spotUsage) + (spotUsage * (1 - spotDiscount));
          
          const cpuCost = baseCpuCost * blendedMultiplier;
          lines.push({ label: 'Fargate vCPU Cost', formula: `${tasks} ${lbl} × ${vcpu} vCPU × ${hrs} hrs × $${cpuRate.toFixed(5)}/hr × ${(util*100).toFixed(0)}% util × ${(blendedMultiplier*100).toFixed(0)}% blended rate`, value: cpuCost });
          const memCost = baseMemCost * blendedMultiplier;
          lines.push({ label: 'Fargate Memory Cost', formula: `${tasks} ${lbl} × ${mem} GB × ${hrs} hrs × $${memRate.toFixed(5)}/hr × ${(util*100).toFixed(0)}% util × ${(blendedMultiplier*100).toFixed(0)}% blended rate`, value: memCost });
          
          let ephCost = 0;
          const ephGB = config.ephemeralStorage || 20;
          if (ephGB > 20) {
            ephCost = tasks * (ephGB - 20) * hrs * (pf.ephemeralGBHour || 0.000111) * util;
            lines.push({ label: 'Ephemeral Storage', formula: `${tasks} ${lbl} × ${ephGB - 20} extra GB × ${hrs} hrs × $0.000111/hr`, value: ephCost });
          }
          
          computeCost = cpuCost + memCost + ephCost;
        } else {
          // EC2 Launch Type for ECS
          const nodeCount = config.nodeCount || 2;
          const nodeType = config.nodeInstanceType || 't3.medium';
          const hourlyRate = pf.instances?.[nodeType] || 0.0416;
          
          const purchase = config.purchaseOption || 'on-demand';
          const discountMap: Record<string, number> = { 'on-demand': 0, 'spot': 0.70, 'reserved': 0.40 };
          const discount = discountMap[purchase] || 0;
          
          const ec2Cost = nodeCount * hourlyRate * hrs * util * (1 - discount);
          lines.push({ label: `EC2 Nodes (${nodeType})`, formula: `${nodeCount} Nodes × $${hourlyRate.toFixed(4)}/hr × ${hrs} hrs × ${(util*100).toFixed(0)}% util × ${((1 - discount) * 100).toFixed(0)}% rate`, value: ec2Cost });
          
          const ebsGB = config.ebsStorage || 30;
          const ebsCost = nodeCount * ebsGB * (pf.ebsGBMonth || 0.08);
          lines.push({ label: 'EBS Storage', formula: `${nodeCount} Nodes × ${ebsGB} GB × $0.08/GB`, value: ebsCost });
          
          computeCost = ec2Cost + ebsCost;
        }
        
        const dtGB = config.dataTransferOut || 100;
        const dtCost = dtGB * (pf.dataTransferGB || 0.09);
        lines.push({ label: 'Data Transfer Out', formula: `${dtGB} GB × $0.09/GB`, value: dtCost });
        
        const crossAzGB = config.crossAzTraffic || 50;
        const crossAzCost = crossAzGB * (pf.crossAzGB || 0.01);
        lines.push({ label: 'Cross-AZ Traffic', formula: `${crossAzGB} GB × $0.01/GB`, value: crossAzCost });
        
        let albCost = 0;
        if (config.loadBalancer !== false) {
          albCost = hrs * (pf.albHourly || 0.0225);
          lines.push({ label: 'ALB Hourly Base', formula: `${hrs} hrs × $0.0225/hr`, value: albCost });
        }
        
        const logsGB = config.cloudWatchLogs || 10;
        const logsCost = logsGB * (pf.logsGB || 0.50);
        lines.push({ label: 'CloudWatch Logs', formula: `${logsGB} GB × $0.50/GB`, value: logsCost });
        
        total = computeCost + dtCost + crossAzCost + albCost + logsCost;
        break;
      }
      case 'sqs': {
        const pf = model?.pricingFactors || {}; const reqM = config.requestsM || 10; const type = config.type || 'standard'; const rate = pf[type] || 0.40; const cost = reqM * rate; 
        lines.push({ label: 'SQS Requests', formula: reqM + 'M × $' + rate.toFixed(2) + '/M', value: cost }); 
        total = cost;
        break;
      }
      case 'sns': {
        const pf = model?.pricingFactors || {}; const pubM = config.publishM || 10; const costPub = pubM * (pf.publish || 0.50); 
        lines.push({ label: 'Publish', formula: pubM + 'M × $0.50/M', value: costPub }); const delM = config.httpM || 10; const costDel = delM * (pf.http || 0.60); 
        lines.push({ label: 'HTTP Delivery', formula: delM + 'M × $0.60/M', value: costDel }); 
        total = costPub + costDel;
        break;
      }
      case 'stepFunctions': {
        const pf = model?.pricingFactors || {}; const type = config.type || 'standard'; let cost = 0; if(type === 'standard') { const trans = config.transitionsM || 1; cost = trans * (pf.standardM || 25.0); 
        lines.push({ label: 'Standard Transitions', formula: trans + 'M × $25.00/M', value: cost }); } else { const reqM = config.expressReqsM || 10; const gbM = config.expressGBsecM || 1; cost = (reqM * 1.0) + (gbM * 16.67); 
        lines.push({ label: 'Express Workflows', formula: reqM + 'M reqs + ' + gbM + 'M GB-s', value: cost }); } 
        total = cost;
        break;
      }
      case 'aurora': {

        const pf = model?.pricingFactors || {};
        const mode = config.mode || 'serverless-v2';
        const count = config.count || 2;
        
        let computeCost = 0;
        if (mode === 'serverless-v2') {
           const acus = config.avgAcus || 2;
           const rate = pf.serverlessAcuHour || 0.12;
           computeCost = count * acus * rate * 730;
           lines.push({ label: 'Aurora Serverless', formula: `${count} Instances × ${acus} ACUs × $${rate}/hr × 730 hrs`, value: computeCost });
        } else {
           const inst = config.instanceClass || 'db.r6g.large';
           const rate = pf.instances?.[inst] || 0.26;
           computeCost = count * rate * 730;
           lines.push({ label: `Aurora Provisioned (${inst})`, formula: `${count} Instances × $${rate}/hr × 730 hrs`, value: computeCost });
        }
        
        const sGB = config.storageSize || 100;
        const sRate = pf.storageGB || 0.10;
        const storageCost = sGB * sRate;
        lines.push({ label: 'Storage', formula: `${sGB} GB × $${sRate}/GB`, value: storageCost });
        
        const ioM = config.ioRequestsM || 10;
        const ioRate = pf.ioRequestPerM || 0.20;
        const ioCost = ioM * ioRate;
        if (ioCost > 0) lines.push({ label: 'I/O Requests', formula: `${ioM}M × $${ioRate}/M`, value: ioCost });
        
        total = computeCost + storageCost + ioCost;

        break;
      }
      case 'eventBridge': {
        const pf = model?.pricingFactors || {}; const evM = config.eventsM || 10; const cost = evM * (pf.eventM || 1.00); 
        lines.push({ label: 'Events Published', formula: evM + 'M × $1.00/M', value: cost }); 
        total = cost;
        break;
      }
      case 'kinesis': {
        const pf = model?.pricingFactors || {};
        const shards = config.shards || 2;
        const hrRate = pf.shardHour || 0.015;
        const shardCost = shards * 730 * hrRate;
        lines.push({ label: 'Shard Hours', formula: shards + ' Shards × 730 hrs × $' + hrRate + '/hr', value: shardCost });
        const putsM = config.putUnitsM || 10;
        const putRate = pf.putM || 0.014;
        const putCost = putsM * putRate;
        lines.push({ label: 'PUT Payload Units', formula: putsM + 'M × $' + putRate + '/M', value: putCost });
        total = shardCost + putCost;

        break;
      }
      case 'msk': {
        const pf = model?.pricingFactors || {};
        const brokers = config.brokers || 2;
        const inst = config.instance || 'kafka.m5.large';
        const rate = pf.instances?.[inst] || 0.24;
        const compCost = brokers * rate * 730;
        lines.push({ label: 'Brokers (' + inst + ')', formula: brokers + ' Brokers × $' + rate + '/hr × 730 hrs', value: compCost });
        const sGB = config.storageGB || 100;
        const sRate = pf.storageGB || 0.10;
        const storageCost = brokers * sGB * sRate;
        lines.push({ label: 'Broker Storage', formula: brokers + ' Brokers × ' + sGB + ' GB × $' + sRate + '/GB', value: storageCost });
        total = compCost + storageCost;

        break;
      }
      case 'cognito': {
        const pf = model?.pricingFactors || {}; const mau = config.mau || 50000; const billable = Math.max(0, mau - (pf.freeTier || 50000)); const cost = billable * (pf.ratePerUser || 0.0055); 
        lines.push({ label: 'MAUs', formula: billable + ' Billable MAUs × $0.0055', value: cost }); 
        total = cost;
        break;
      }
      case 'waf': {
        const pf = model?.pricingFactors || {}; const acls = config.acls || 1; const costAcl = acls * (pf.aclMonth || 5.0); const rules = config.rules || 5; const costRules = acls * rules * (pf.ruleMonth || 1.0); const reqs = config.requestsM || 10; const costReqs = reqs * (pf.reqM || 0.60); 
        lines.push({ label: 'WAF ACLs & Rules', formula: acls + ' ACLs, ' + rules + ' Rules', value: costAcl + costRules }); 
        lines.push({ label: 'Requests Analyzed', formula: reqs + 'M × $0.60/M', value: costReqs }); 
        total = costAcl + costRules + costReqs;
        break;
      }
      case 'efs': {
        const pf = model?.pricingFactors || {};
        const sClass = config.storageClass || 'standard';
        const sGB = config.storageGB || 100;
        const sRate = pf.storage?.[sClass] || 0.30;
        const storageCost = sGB * sRate;
        lines.push({ label: 'EFS Storage (' + sClass + ')', formula: sGB + ' GB × $' + sRate + '/GB', value: storageCost });
        const tp = config.provisionedThroughput || 0;
        const tpCost = tp * (pf.throughputMBps || 6.0);
        if (tpCost > 0) lines.push({ label: 'Provisioned Throughput', formula: tp + ' MB/s × $6.00/MBps', value: tpCost });
        total = storageCost + tpCost;

        break;
      }
      case 'athena': {
        const pf = model?.pricingFactors || {};
        const dataTB = config.dataTB || 10;
        const rate = pf.perTB || 5.00;
        const cost = dataTB * rate;
        lines.push({ label: 'Data Scanned', formula: dataTB + ' TB × $' + rate.toFixed(2) + '/TB', value: cost });
        total = cost;

        break;
      }
      case 'secretsManager': {
        const pf = model?.pricingFactors || {}; const sec = config.secrets || 10; const costSec = sec * (pf.secretMonth || 0.40); 
        lines.push({ label: 'Secrets Stored', formula: sec + ' Secrets × $0.40', value: costSec }); const calls = config.callsM || 1; const costCall = calls * (pf.callM || 0.05); 
        lines.push({ label: 'API Calls', formula: calls + 'M × $0.05/M', value: costCall }); 
        total = costSec + costCall;
        break;
      }
      case 'transitGateway': {
        const pf = model?.pricingFactors || {};
        const att = config.attachments || 2;
        const attCost = att * 730 * (pf.attachmentHourly || 0.05);
        lines.push({ label: 'Attachments Hourly', formula: att + ' attachments × 730 hrs × $0.05/hr', value: attCost });
        const dataGB = config.dataGB || 100;
        const dataCost = dataGB * (pf.dataGB || 0.02);
        lines.push({ label: 'Data Processed', formula: dataGB + ' GB × $0.02/GB', value: dataCost });
        total = attCost + dataCost;

        break;
      }
      case 'directConnect': {
        const pf = model?.pricingFactors || {};
        const speed = config.speed || '1g';
        const portRate = pf.portRates?.[speed] || 0.30;
        const portCost = portRate * 730;
        lines.push({ label: 'Port Hourly (' + speed + ')', formula: '730 hrs × $' + portRate + '/hr', value: portCost });
        const dtOut = config.dataTransferOut || 1000;
        const dtCost = dtOut * (pf.dataTransferGB || 0.02);
        lines.push({ label: 'Data Transfer Out', formula: dtOut + ' GB × $0.02/GB', value: dtCost });
        total = portCost + dtCost;

        break;
      }
      case 'globalAccelerator': {
        const pf = model?.pricingFactors || {};
        const accs = config.accelerators || 1;
        const hrCost = accs * 730 * (pf.hourly || 0.025);
        lines.push({ label: 'Accelerator Hourly', formula: accs + ' Accelerators × 730 hrs × $0.025/hr', value: hrCost });
        const dataGB = config.dataGB || 1000;
        const dtCost = dataGB * (pf.dataGB || 0.015);
        lines.push({ label: 'Data Transfer', formula: dataGB + ' GB × $0.015/GB', value: dtCost });
        total = hrCost + dtCost;

        break;
      }
      case 'xray': {
        const pf = model?.pricingFactors || {}; const tr = config.tracesM || 1; const costTr = tr * (pf.recordM || 5.0); 
        lines.push({ label: 'Traces Recorded', formula: tr + 'M × $5.00/M', value: costTr }); const sc = config.scansM || 10; const costSc = sc * (pf.scanM || 0.50); 
        lines.push({ label: 'Traces Scanned', formula: sc + 'M × $0.50/M', value: costSc }); 
        total = costTr + costSc;
        break;
      }
      case 'openSearch': {
        const pf = model?.pricingFactors || {};
        const nodes = config.nodes || 2;
        const inst = config.instance || 'r6g.large';
        const rate = pf.instances?.[inst] || 0.167;
        const compCost = nodes * rate * 730;
        lines.push({ label: 'Data Nodes (' + inst + ')', formula: nodes + ' Nodes × $' + rate + '/hr × 730 hrs', value: compCost });
        const gb = config.storageGB || 100;
        const sRate = pf.storageGB || 0.122;
        const storageCost = gb * sRate;
        lines.push({ label: 'EBS Storage', formula: gb + ' GB × $' + sRate + '/GB', value: storageCost });
        total = compCost + storageCost;

        break;
      }
      case 'redshift': {
        const pf = model?.pricingFactors || {};
        const type = config.type || 'provisioned';
        const hours = config.hours || 730;
        let compCost = 0;
        if (type === 'provisioned') {
           const nodes = config.nodes || 2;
           const inst = config.instance || 'ra3.xlplus';
           const rate = pf.instances?.[inst] || 1.086;
           compCost = nodes * rate * hours;
           lines.push({ label: 'Provisioned Nodes (' + inst + ')', formula: nodes + ' Nodes × $' + rate + '/hr × ' + hours + ' hrs', value: compCost });
        } else {
           const rpus = config.rpus || 32;
           const rate = pf.rpuHour || 0.36;
           compCost = rpus * rate * hours;
           lines.push({ label: 'Serverless Compute', formula: rpus + ' RPUs × $' + rate + '/hr × ' + hours + ' hrs', value: compCost });
        }
        const tb = config.storageTB || 1;
        const sRate = pf.storageTB || 24.576;
        const storageCost = tb * sRate;
        lines.push({ label: 'Managed Storage', formula: tb + ' TB × $' + sRate.toFixed(3) + '/TB', value: storageCost });
        total = compCost + storageCost;

        break;
      }
      case 'glue': {
        const pf = model?.pricingFactors || {};
        const dpus = config.dpus || 10;
        const hours = config.hours || 50;
        const rate = pf.dpuHour || 0.44;
        const jobCost = dpus * hours * rate;
        if (jobCost > 0) lines.push({ label: 'ETL Jobs', formula: dpus + ' DPUs × ' + hours + ' hrs × $' + rate + '/hr', value: jobCost });
        const crawlHr = config.crawlers || 10;
        const crawlCost = crawlHr * rate;
        if (crawlCost > 0) lines.push({ label: 'Crawlers', formula: crawlHr + ' DPU-hrs × $' + rate + '/hr', value: crawlCost });
        total = jobCost + crawlCost;

        break;
      }
      case 'emr': {
        const pf = model?.pricingFactors || {};
        const nodes = config.nodes || 3;
        const inst = config.instance || 'm5.xlarge';
        const hours = config.hours || 100;
        const rate = pf.instances?.[inst] || 0.24;
        const cost = nodes * rate * hours;
        lines.push({ label: 'EMR Cluster (' + inst + ')', formula: nodes + ' Nodes × $' + rate + '/hr × ' + hours + ' hrs', value: cost });
        total = cost;

        break;
      }
      case 'kinesisFirehose': {
        const pf = model?.pricingFactors || {};
        const gb = config.dataGB || 100;
        const rate = pf.ingestGB || 0.029;
        const ingestCost = gb * rate;
        lines.push({ label: 'Data Ingestion', formula: gb + ' GB × $' + rate + '/GB', value: ingestCost });
        let convCost = 0;
        if (config.conversion) {
           const cRate = pf.convertGB || 0.018;
           convCost = gb * cRate;
           lines.push({ label: 'Format Conversion', formula: gb + ' GB × $' + cRate + '/GB', value: convCost });
        }
        total = ingestCost + convCost;

        break;
      }
      case 'mq': {
        const pf = model?.pricingFactors || {}; const b = config.brokers || 1; const inst = config.instance || 'mq.m5.large'; const rate = pf.instances?.[inst] || 0.34; const cost = b * rate * 730; 
        lines.push({ label: 'MQ Brokers', formula: b + ' Brokers × $' + rate + '/hr × 730 hrs', value: cost }); 
        total = cost;
        break;
      }
      case 'kms': {
        const pf = model?.pricingFactors || {}; const keys = config.keys || 5; const costKeys = keys * (pf.keyMonth || 1.0); 
        lines.push({ label: 'CMKs', formula: keys + ' Keys × $1.00', value: costKeys }); const reqM = config.requestsM || 10; const costReq = reqM * (pf.reqM || 0.03); 
        lines.push({ label: 'API Requests', formula: reqM + 'M × $0.03/M', value: costReq }); 
        total = costKeys + costReq;
        break;
      }
      case 'shield': {
        const pf = model?.pricingFactors || {}; const adv = config.advanced || false; const cost = adv ? (pf.advancedMonth || 3000) : 0; if (adv) 
        lines.push({ label: 'Shield Advanced', formula: '$3000 / month flat', value: cost }); 
        total = cost;
        break;
      }
      case 'organizations': {
        
        lines.push({ label: 'AWS Organizations is free', formula: '0.00', value: 0 }); 
        total = 0;
        break;
      }
      case 'codePipeline': {
        const pf = model?.pricingFactors || {}; const p = config.pipelines || 5; const cost = p * (pf.pipelineMonth || 1.0); 
        lines.push({ label: 'Active Pipelines', formula: p + ' Pipelines × $1.00', value: cost }); 
        total = cost;
        break;
      }
      case 'codeBuild': {
        const pf = model?.pricingFactors || {}; const min = config.minutes || 1000; const type = config.computeType || 'general1.small'; const rate = pf.rates?.[type] || 0.005; const cost = min * rate; 
        lines.push({ label: 'Build Compute', formula: min + ' min × $' + rate + '/min', value: cost }); 
        total = cost;
        break;
      }
      case 'codeDeploy': {
        const pf = model?.pricingFactors || {}; const up = config.onPremUpdates || 0; const cost = up * (pf.updateRate || 0.02); if (cost > 0) 
        lines.push({ label: 'On-Prem Updates', formula: up + ' Updates × $0.02', value: cost }); 
        total = cost;
        break;
      }
      case 'bedrock': {
        const pf = model?.pricingFactors || {};
        const m = config.model || 'claude-haiku';
        const inM = config.inTokensM || 10;
        const outM = config.outTokensM || 2;
        const inRate = pf.inM?.[m] || 0.25;
        const outRate = pf.outM?.[m] || 1.25;
        const inCost = inM * inRate;
        const outCost = outM * outRate;
        lines.push({ label: 'Input Tokens (' + m + ')', formula: inM + 'M × $' + inRate + '/M', value: inCost });
        lines.push({ label: 'Output Tokens (' + m + ')', formula: outM + 'M × $' + outRate + '/M', value: outCost });
        total = inCost + outCost;

        break;
      }
      case 'sageMaker': {
        const pf = model?.pricingFactors || {};
        const type = config.type || 'instance';
        let computeCost = 0;
        if (type === 'instance') {
           const inst = config.instance || 'ml.m5.large';
           const count = config.count || 1;
           const rate = pf.instances?.[inst] || 0.134;
           computeCost = count * rate * 730;
           lines.push({ label: 'Hosting (' + inst + ')', formula: count + ' Instances × $' + rate + '/hr × 730 hrs', value: computeCost });
        } else {
           const mem = config.memoryMB || 2048;
           const dur = config.durationMs || 500;
           const invM = config.invocationsM || 1;
           const gbSec = invM * 1000000 * (dur/1000) * (mem/1024);
           const rate = pf.serverlessGBsec || 0.000020;
           const reqRate = pf.serverlessReqM || 0.20;
           const gbCost = gbSec * rate;
           const reqCost = invM * reqRate;
           computeCost = gbCost + reqCost;
           lines.push({ label: 'Serverless Compute', formula: Math.round(gbSec) + ' GB-s × $' + rate + '/GB-s', value: gbCost });
           lines.push({ label: 'Serverless Requests', formula: invM + 'M × $' + reqRate + '/M', value: reqCost });
        }
        const trainHr = config.trainingHours || 10;
        const trainRate = pf.trainingHourly || 1.50;
        const trainCost = trainHr * trainRate;
        if (trainCost > 0) lines.push({ label: 'Training Jobs', formula: trainHr + ' hrs × $' + trainRate + '/hr', value: trainCost });
        total = computeCost + trainCost;

        break;
      }
      case 'appSync': {
        const pf = model?.pricingFactors || {}; const reqM = config.requestsM || 10; const costReq = reqM * (pf.reqM || 4.0); 
        lines.push({ label: 'GraphQL Requests', formula: reqM + 'M × $4.00/M', value: costReq }); const dt = config.dtGB || 100; const costDt = dt * (pf.dtGB || 0.09); 
        lines.push({ label: 'Data Transfer', formula: dt + ' GB × $0.09/GB', value: costDt }); 
        total = costReq + costDt;
        break;
      }
      case 'iotCore': {
        const pf = model?.pricingFactors || {}; const msg = config.messagesM || 50; const costMsg = msg * (pf.msgM || 1.0); 
        lines.push({ label: 'Messages', formula: msg + 'M × $1.00/M', value: costMsg }); const rules = config.rulesM || 50; const costRules = rules * (pf.ruleM || 0.15); 
        lines.push({ label: 'Rules Executed', formula: rules + 'M × $0.15/M', value: costRules }); 
        total = costMsg + costRules;
        break;
      }
      case 'rekognition': {
        const pf = model?.pricingFactors || {}; const img = config.imagesM || 1; const cost = img * (pf.imageM || 1000); 
        lines.push({ label: 'Image Processing', formula: img + 'M × $1000/M', value: cost }); 
        total = cost;
        break;
      }
      case 'textract': {
        const pf = model?.pricingFactors || {}; const pages = config.pagesM || 0.1; const cost = pages * (pf.pageM || 1500); 
        lines.push({ label: 'Page Extraction', formula: pages + 'M × $1500/M', value: cost }); 
        total = cost;
        break;
      }
      case 'mediaConvert': {
        const pf = model?.pricingFactors || {}; const min = config.minutesHD || 1000; const cost = min * (pf.minHD || 0.017); 
        lines.push({ label: 'HD Conversion', formula: min + ' min × $0.017/min', value: cost }); 
        total = cost;
        break;
      }
      case 'cloudTrail': {
        const pf = model?.pricingFactors || {}; const ev = config.eventsM || 10; const cost = ev * (pf.eventM || 1.0); 
        lines.push({ label: 'Data Events', formula: ev + 'M × $1.00/M', value: cost }); 
        total = cost;
        break;
      }
      case 'backup': {
        const pf = model?.pricingFactors || {}; const wGB = config.warmGB || 100; const costW = wGB * (pf.warmGB || 0.05); 
        lines.push({ label: 'Warm Storage', formula: wGB + ' GB × $0.05/GB', value: costW }); const cGB = config.coldGB || 0; const costC = cGB * (pf.coldGB || 0.01); 
        lines.push({ label: 'Cold Storage', formula: cGB + ' GB × $0.01/GB', value: costC }); 
        total = costW + costC;
        break;
      }
      case 'appRunner': {
        const pf = model?.pricingFactors || {}; const inst = config.instances || 2; const vcpu = config.vcpu || 1; const mem = config.memGB || 2; const cpuRate = pf.cpuHour || 0.064; const memRate = pf.memHour || 0.007; const cost = inst * 730 * ((vcpu * cpuRate) + (mem * memRate)); 
        lines.push({ label: 'AppRunner Instances', formula: inst + ' Inst × 730 hrs', value: cost }); 
        total = cost;
        break;
      }
      case 'elasticBeanstalk': {
        
        lines.push({ label: 'Elastic Beanstalk (Free)', formula: 'Compute billed separately under EC2', value: 0 }); 
        total = 0;
        break;
      }
      case 'fsx': {
        const pf = model?.pricingFactors || {};
        const type = config.type || 'windows';
        const deploy = config.deployment || 'singleAz';
        const sGB = config.storageGB || 500;
        const rateKey = type + (deploy === 'multiAz' ? 'Multi' : 'Single');
        const sRate = pf[rateKey] || 0.13;
        const storageCost = sGB * sRate;
        lines.push({ label: 'FSx Storage (' + type + ')', formula: sGB + ' GB × $' + sRate + '/GB', value: storageCost });
        const tp = config.throughputMBps || 8;
        const tpCost = tp * (pf.throughputRate || 1.18);
        lines.push({ label: 'Throughput Capacity', formula: tp + ' MB/s × $' + (pf.throughputRate || 1.18) + '/MBps', value: tpCost });
        total = storageCost + tpCost;

        break;
      }
      case 'certificateManager': {
        
        lines.push({ label: 'ACM Public Certs are free', formula: '0.00', value: 0 }); 
        total = 0;
        break;
      }
      case 'systemsManager': {
        const pf = model?.pricingFactors || {}; const inst = config.advancedInst || 0; const costInst = inst * 730 * (pf.instHour || 0.00695); if (costInst > 0) 
        lines.push({ label: 'Advanced Instances', formula: inst + ' Inst × 730 hrs', value: costInst }); const calls = config.paramCallsM || 10; const costCalls = calls * (pf.callM || 0.05); 
        lines.push({ label: 'Parameter Calls', formula: calls + 'M × $0.05/M', value: costCalls }); 
        total = costInst + costCalls;
        break;
      }
      case 'ecr': {
        const pf = model?.pricingFactors || {}; const gb = config.storageGB || 50; const cost = gb * (pf.storageGB || 0.10); 
        lines.push({ label: 'ECR Storage', formula: gb + ' GB × $0.10/GB', value: cost }); 
        total = cost;
        break;
      }
      case 'privateLink': {
        const pf = model?.pricingFactors || {};
        const eps = config.endpoints || 1;
        const hrCost = eps * 730 * (pf.endpointHourly || 0.01);
        lines.push({ label: 'Endpoint Hourly', formula: eps + ' endpoints × 730 hrs × $0.01/hr', value: hrCost });
        const dataGB = config.dataGB || 100;
        const dataCost = dataGB * (pf.dataGB || 0.01);
        lines.push({ label: 'Data Processed', formula: dataGB + ' GB × $0.01/GB', value: dataCost });
        total = hrCost + dataCost;

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

    const regOpt = this.regions.find(r => r.code === region) || this.regions[0];
    const multiplier = regOpt.multiplier;
    let finalTotal = total;

    if (multiplier !== 1.0 && total > 0) {
      finalTotal = total * multiplier;
      lines.push({
        label: 'Regional Adjustment',
        formula: `$${total.toFixed(2)} × ${multiplier}x (${regOpt.code})`,
        value: finalTotal - total,
        note: `Base pricing scaled for ${regOpt.name}`
      });
    }

    return { lines, total: Math.max(0, finalTotal), freeTierNote };
  }

  calculateNodeCostUsd(node: ArchitectureNode, region: string = 'us-east-1'): number {
    return this.getCostBreakdown(node, region).total;
  }
}
