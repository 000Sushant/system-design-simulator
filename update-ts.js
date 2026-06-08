const fs = require('fs');
const path = 'src/app/core/services/cost.service.ts';
let code = fs.readFileSync(path, 'utf8');

const newCases = `      case 'elb': {
        const pf = model?.pricingFactors || {};
        const instances = config.instanceCount || 1;
        const lcus = config.lcuCount || 1;
        const hourlyRate = pf.hourly || 0.0225;
        const lcuRate = pf.lcu || 0.008;
        const hourlyCost = instances * 730 * hourlyRate;
        lines.push({ label: 'Hourly Charge', formula: \`\${instances} instances × 730 hrs × $\${hourlyRate.toFixed(4)}/hr\`, value: hourlyCost });
        const lcuCost = lcus * 730 * lcuRate;
        lines.push({ label: 'LCU Charge', formula: \`\${lcus} LCUs × 730 hrs × $\${lcuRate.toFixed(3)}/LCU\`, value: lcuCost });
        total = hourlyCost + lcuCost;
        break;
      }
      case 'vpc': {
        const pf = model?.pricingFactors || {};
        const endpoints = config.endpoints || 0;
        const endpointGB = config.endpointGB || 0;
        const peeringGB = config.peeringGB || 0;
        const epHourlyCost = endpoints * 730 * (pf.endpointHourly || 0.01);
        if (endpoints > 0) lines.push({ label: 'Endpoint Hourly', formula: \`\${endpoints} endpoints × 730 hrs × $0.01/hr\`, value: epHourlyCost });
        const epDataCost = endpointGB * (pf.endpointGB || 0.01);
        if (endpointGB > 0) lines.push({ label: 'Endpoint Data', formula: \`\${endpointGB} GB × $0.01/GB\`, value: epDataCost });
        const peeringCost = peeringGB * (pf.peeringGB || 0.02);
        if (peeringGB > 0) lines.push({ label: 'Peering Data', formula: \`\${peeringGB} GB × $0.02/GB\`, value: peeringCost });
        total = epHourlyCost + epDataCost + peeringCost;
        break;
      }
      case 'natGateway': {
        const pf = model?.pricingFactors || {};
        const instances = config.instances || 1;
        const dataGB = config.dataGB || 100;
        const hourlyCost = instances * 730 * (pf.hourly || 0.045);
        lines.push({ label: 'Hourly Charge', formula: \`\${instances} NATs × 730 hrs × $0.045/hr\`, value: hourlyCost });
        const dataCost = dataGB * (pf.perGB || 0.045);
        lines.push({ label: 'Data Processing', formula: \`\${dataGB} GB × $0.045/GB\`, value: dataCost });
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
        if (metrics > 0) lines.push({ label: 'Custom Metrics', formula: \`\${metrics} metrics × $0.30/metric\`, value: metricsCost });
        const logsCost = logs * (pf.logsGB || 0.50);
        if (logs > 0) lines.push({ label: 'Log Ingestion', formula: \`\${logs} GB × $0.50/GB\`, value: logsCost });
        const alarmsCost = alarms * (pf.alarm || 0.10);
        if (alarms > 0) lines.push({ label: 'Alarms', formula: \`\${alarms} alarms × $0.10/alarm\`, value: alarmsCost });
        const billableDashboards = Math.max(0, dashboards - (pf.freeDashboards || 3));
        const dashCost = billableDashboards * (pf.dashboard || 3.00);
        if (dashboards > 0) lines.push({ label: 'Dashboards', formula: \`max(0, \${dashboards} − 3 free) × $3.00\`, value: dashCost });
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
          lines.push({ label: 'Provisioned Writes', formula: \`\${wcu} WCU × 730 hrs × $0.00065/hr\`, value: wcuCost });
          const rcuCost = rcu * 730 * (pf.rcuHour || 0.00013);
          lines.push({ label: 'Provisioned Reads', formula: \`\${rcu} RCU × 730 hrs × $0.00013/hr\`, value: rcuCost });
          capCost = wcuCost + rcuCost;
        } else {
          const wruCost = wru * (pf.wruMillion || 1.25);
          lines.push({ label: 'On-Demand Writes', formula: \`\${wru}M requests × $1.25/M\`, value: wruCost });
          const rruCost = rru * (pf.rruMillion || 0.25);
          lines.push({ label: 'On-Demand Reads', formula: \`\${rru}M requests × $0.25/M\`, value: rruCost });
          capCost = wruCost + rruCost;
        }
        const billableStorage = Math.max(0, storage - (pf.freeStorageGB || 25));
        const storageCost = billableStorage * (pf.storageGB || 0.25);
        lines.push({ label: 'Storage', formula: \`max(0, \${storage} − 25 free) × $0.25/GB\`, value: storageCost });
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
        lines.push({ label: 'DB Compute', formula: \`$\${hourly}/hr × 730 hrs × \${multiplier}\`, value: computeCost, note: \`\${type} \${multi ? '(Multi-AZ)' : ''}\` });
        const storageCost = storage * (pf.storageGB || 0.115) * multiplier;
        lines.push({ label: 'DB Storage (gp3)', formula: \`\${storage} GB × $0.115/GB × \${multiplier}\`, value: storageCost });
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
        lines.push({ label: 'Node Compute', formula: \`\${nodes} nodes × $\${hourly}/hr × 730 hrs\`, value: computeCost, note: type });
        const backupCost = backup * (pf.backupGB || 0.085);
        if (backup > 0) lines.push({ label: 'Backup Storage', formula: \`\${backup} GB × $0.085/GB\`, value: backupCost });
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
        lines.push({ label: 'vCPU Cost', formula: \`\${tasks} \${lbl} × \${vcpu} vCPU × \${hrs} hrs × $0.04048/hr\`, value: cpuCost });
        const memCost = tasks * mem * hrs * (pf.memHour || 0.004445);
        lines.push({ label: 'Memory Cost', formula: \`\${tasks} \${lbl} × \${mem} GB × \${hrs} hrs × $0.004445/hr\`, value: memCost });
        total = cpuCost + memCost;
        break;
      }
      case 'sqs': {
        const pf = model?.pricingFactors || {};
        const type = config.queueType || 'standard';
        const reqs = config.requestsM || 10;
        const rate = type === 'fifo' ? (pf.fifo || 0.50) : (pf.standard || 0.40);
        const reqCost = reqs * rate;
        lines.push({ label: 'Requests Cost', formula: \`\${reqs}M × $\${rate.toFixed(2)}/M\`, value: reqCost, note: type });
        total = reqCost;
        break;
      }
      case 'sns': {
        const pf = model?.pricingFactors || {};
        const pub = config.publishM || 10;
        const http = config.httpDeliveriesM || 10;
        const email = config.emailDeliveriesM || 0;
        const pubCost = pub * (pf.publish || 0.50);
        if (pub > 0) lines.push({ label: 'Publish Cost', formula: \`\${pub}M × $0.50/M\`, value: pubCost });
        const httpCost = http * (pf.http || 0.60);
        if (http > 0) lines.push({ label: 'HTTP Delivery', formula: \`\${http}M × $0.60/M\`, value: httpCost });
        const emailCost = email * (pf.email || 20.00);
        if (email > 0) lines.push({ label: 'Email Delivery', formula: \`\${email}M × $20.00/M\`, value: emailCost });
        total = pubCost + httpCost + emailCost;
        break;
      }
      case 'stepFunctions': {
        const pf = model?.pricingFactors || {};
        const type = config.workflowType || 'standard';
        if (type === 'standard') {
          const trans = config.transitionsM || 1;
          const cost = trans * (pf.standard || 25.00);
          lines.push({ label: 'Standard Transitions', formula: \`\${trans}M × $25.00/M\`, value: cost });
          total = cost;
        } else {
          const reqs = config.expressRequestsM || 0;
          const gb = config.expressGBsecM || 0;
          const reqCost = reqs * (pf.expressReq || 1.00);
          if (reqs > 0) lines.push({ label: 'Express Requests', formula: \`\${reqs}M × $1.00/M\`, value: reqCost });
          const compCost = gb * (pf.expressGBsec || 16.67);
          if (gb > 0) lines.push({ label: 'Express Compute', formula: \`\${gb}M GB-sec × $16.67/M\`, value: compCost });
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
      }`;

// Replace default block
const startIdx = code.indexOf('      default: {');
const endIdx = code.indexOf('return { lines', startIdx);
if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + newCases + '\n\n    ' + code.substring(endIdx);
} else {
  console.error("Could not find default block!");
}

// Remove calculateNodeCostUsdLegacy
const legacyStart = code.indexOf('  /** Legacy cost calculation');
if (legacyStart !== -1) {
  code = code.substring(0, legacyStart).trimEnd() + '\n}\n';
}

fs.writeFileSync(path, code);
