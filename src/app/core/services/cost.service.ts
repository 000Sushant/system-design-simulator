import { Injectable } from '@angular/core';
import { ArchitectureNode, Currency } from '../models/architecture.model';

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

  private readonly instancePricing: Record<string, number> = {
    nano: 4.0,
    micro: 8.5,
    small: 17.0,
    medium: 34.0,
    large: 68.0,
    xlarge: 136.0,
    '2xlarge': 272.0,
    '4xlarge': 544.0
  };

  private readonly storagePricing: Record<string, number> = {
    standard: 0.023,
    'infrequent-access': 0.0125,
    glacier: 0.004
  };

  getCurrencySymbol(currency: Currency): string {
    return this.currencySymbols[currency];
  }

  calculateTotalMonthlyCost(nodes: ArchitectureNode[], currency: Currency = 'USD'): number {
    const totalUsd = nodes.reduce((sum, node) => sum + this.calculateNodeCostUsd(node), 0);
    return totalUsd * this.conversionRates[currency];
  }

  calculateNodeCostUsd(node: ArchitectureNode): number {
    const { config } = node;
    let cost = 0;

    // Monthly factors
    const requestsPerMonth = (config.requestRate || config.throughput || 0) * 60 * 60 * 24 * 30;
    const millionsOfRequests = requestsPerMonth / 1_000_000;
    const dataTransferCost = (config.dataTransferOut || 0) * 0.09; // $0.09 per GB

    switch (node.type) {
      case 'ec2': {
        const size = config.instanceSize || 'micro';
        const instanceMonthly = this.instancePricing[size] || this.instancePricing['micro'];
        cost = instanceMonthly * (config.replication || 1);
        break;
      }

      case 'rds': {
        // Instance cost + storage cost
        const rdsSize = config.instanceSize || 'micro';
        const rdsInstanceMonthly = this.instancePricing[rdsSize] || this.instancePricing['micro'];
        const rdsStorageCost = (config.storageSize || 20) * 0.115; // ~$0.115/GB for gp3
        cost = rdsInstanceMonthly * (config.replication || 1) + rdsStorageCost;
        break;
      }

      case 'elastiCache': {
        // Instance cost per node
        const elastiCacheSize = config.instanceSize || 'micro';
        const elastiCacheInstanceMonthly = this.instancePricing[elastiCacheSize] || this.instancePricing['micro'];
        cost = elastiCacheInstanceMonthly * (config.replication || 1);
        break;
      }

      case 'ecs': {
        // Fargate pricing: vCPU + Memory
        // cpu=100 means 1 vCPU (~$29.55/mo), memory=100 means 1 GB (~$3.25/mo)
        const vCpuCount = (config.cpu || 25) / 100;
        const memoryGb = (config.memory || 50) / 100;
        const perTaskCost = (vCpuCount * 29.55) + (memoryGb * 3.25);
        cost = perTaskCost * (config.replication || 1);
        break;
      }

      case 'lambda': {
        // Compute cost: GB-seconds pricing + Request cost
        const memoryGb = (config.memory || 128) / 1024;
        const latencySec = (config.latency || 100) / 1000;
        const computeGbSeconds = requestsPerMonth * latencySec * memoryGb;
        // $0.0000166667 per GB-second
        const computeCost = computeGbSeconds * 0.0000166667;
        // $0.20 per million requests
        const requestCost = millionsOfRequests * 0.20;
        cost = computeCost + requestCost;
        break;
      }

      case 'apiGateway':
        cost = millionsOfRequests * 3.50; // $3.50 per million requests
        break;

      case 's3': {
        const sClass = config.storageClass || 'standard';
        const s3StorageCost = (config.storageSize || 0) * (this.storagePricing[sClass] || 0.023);
        const s3RequestCost = millionsOfRequests * 0.005; // blended GET/PUT average
        cost = s3StorageCost + s3RequestCost + dataTransferCost;
        break;
      }

      case 'dynamoDb': {
        // Provisioned capacity: WCU + RCU + storage
        const wcu = (config.requestRate || 0) * 0.5;
        const rcu = (config.requestRate || 0) * 0.5;
        const dynamoStorageCost = (config.storageSize || 0) * 0.25; // $0.25/GB/month
        cost = (wcu * 0.65) + (rcu * 0.13) + dynamoStorageCost;
        break;
      }

      case 'sqs':
        cost = millionsOfRequests * 0.40; // $0.40 per million messages
        break;

      case 'sns':
        cost = millionsOfRequests * 0.50; // $0.50 per million publishes
        break;

      case 'cloudfront':
        // $0.085/GB data transfer + $1.00 per million requests
        cost = (config.dataTransferOut || 0) * 0.085 + (millionsOfRequests * 1.00);
        break;

      case 'alb':
        // $16.43 base/mo + LCU charges (data processed approximation)
        cost = 16.43 + ((config.dataTransferOut || 0) * 0.008);
        break;

      case 'stepFunctions':
        cost = millionsOfRequests * 25.0; // $25 per million state transitions
        break;

      case 'natGateway': {
        // $32.40 base/mo + $0.045/GB data processing
        const natProcessingCost = (config.dataTransferOut || 0) * 0.045;
        cost = 32.40 + natProcessingCost + dataTransferCost;
        break;
      }

      case 'cloudWatch':
        // $0.50 per GB of log data ingested
        cost = (config.storageSize || 0) * 0.50;
        break;

      case 'route53':
        // $0.50/hosted zone + $0.40 per million queries
        cost = 0.50 + (millionsOfRequests * 0.40);
        break;
      
      case 'batch': {
        // AWS Batch (Fargate) pricing: vCPU-seconds + Memory-seconds
        // We use the same base rates as ECS for consistency
        const vCpuCount = (config.cpu || 200) / 100;
        const memoryGb = (config.memory || 1024) / 1024;
        const latencySec = (config.latency || 300000) / 1000;
        
        const totalComputeSeconds = requestsPerMonth * latencySec;
        const secondsInMonth = 30 * 24 * 3600;
        const computeMonthRatio = totalComputeSeconds / secondsInMonth;
        
        // $29.55/mo per vCPU, $3.25/mo per GB RAM
        cost = computeMonthRatio * ((vCpuCount * 29.55) + (memoryGb * 3.25));
        break;
      }

      default:
        cost = 0;
        break;
    }

    return Math.max(0, cost);
  }
}
