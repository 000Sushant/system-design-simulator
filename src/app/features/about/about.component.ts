import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  @Output() close = new EventEmitter<void>();

  services = [
    { name: 'Compute', services: 'EC2, Lambda, ECS, ASG, AWS Batch', costParams: 'Instance Size, Duration, vCPU/RAM', loadParams: 'Concurrency, Memory, Duration' },
    { name: 'Storage', services: 'S3, EBS (attached to EC2)', costParams: 'Storage Class, Capacity (GB)', loadParams: 'N/A' },
    { name: 'Database', services: 'RDS, DynamoDB, ElastiCache', costParams: 'Instance Class, Read/Write Capacity', loadParams: 'Provisioned IOPS, TTL' },
    { name: 'Networking', services: 'Route 53, CloudFront, API Gateway, ALB', costParams: 'Requests (millions), Traffic out', loadParams: 'Latency, Error Rate' },
    { name: 'Integration', services: 'SQS, SNS, Step Functions', costParams: 'Messages, Workflow Steps', loadParams: 'Visibility Timeout, Fan-out' },
    { name: 'Observability', services: 'CloudWatch', costParams: 'Logs/Metrics Ingestion', loadParams: 'Retention' }
  ];

  simulationHighlights = [
    { title: 'Load Simulation', description: 'Packets represent real-time traffic. Each node processes packets based on its throughput and latency settings. Overloaded nodes (100% CPU) start dropping packets.' },
    { title: 'Cost Estimation', description: 'Deterministic formulas calculate monthly costs based on your architecture. We factor in provisioned capacity, resource consumption (Batch/Lambda), and fixed hourly rates.' },
    { title: 'Visual Feedback', description: 'Connection lines change thickness and color based on traffic intensity. Red indicates errors or high packet drop rates, while glowing pulses show active flow.' }
  ];
}
