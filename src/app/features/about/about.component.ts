import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  @Output() close = new EventEmitter<void>();

  readonly whatsNew = [
    {
      title: 'In-depth Cost Calculation Parameters',
      icon: 'fas fa-sliders-h',
      description: 'Deep AWS-style pricing controls now simulate real-world infrastructure billing behavior with advanced cost-impacting variables.'
    },
    {
      title: 'Transparent Cost Intelligence',
      icon: 'fas fa-receipt',
      description: 'Every estimate is fully explainable with visible pricing formulas, usage amplification, and service-level billing breakdowns.'
    },
    {
      title: 'Compact Adaptive Run Stats',
      icon: 'fas fa-wave-square',
      description: 'The floating simulation control center has responsive Dynamic Island-inspired behavior across all screen sizes.'
    }
  ];

  readonly engineModules = [
    {
      title: 'Real-Time Load Simulation',
      visualClass: 'load-visual',
      description: 'Traffic packets move dynamically across services based on configured throughput, latency, retry amplification, and processing capacity.',
      points: ['Packet drops emerge visually', 'Connection lines glow red under stress', 'Congestion ripples spread across the architecture']
    },
    {
      title: 'Deterministic Cost Intelligence',
      visualClass: 'cost-visual',
      description: 'AWS-style billing behavior is calculated from repeatable formulas so each estimate can be inspected and explained.',
      points: ['Visible pricing formulas', 'Request amplification math', 'Cost-per-service contribution']
    },
    {
      title: 'Reactive Visual Feedback',
      visualClass: 'feedback-visual',
      description: 'The platform reacts to infrastructure behavior in real time with tactical signals that make system health readable at a glance.',
      points: ['Latency ripple distortion', 'Overloaded services pulse red', 'Successful traffic emits glow trails']
    }
  ];

  readonly supportedServices = ['HTTP APIs', 'REST APIs', 'WebSockets', 'Lambda', 'EC2', 'RDS', 'S3', 'CloudFront', 'DynamoDB', 'ElastiCache'];

  readonly feedbackItems = [
    { icon: 'fas fa-route', text: 'Connection lines expand under load' },
    { icon: 'fas fa-water', text: 'Latency creates ripple distortion' },
    { icon: 'fas fa-heartbeat', text: 'Failed systems pulse red' },
    { icon: 'fas fa-sparkles', text: 'Successful traffic emits glow trails' },
    { icon: 'fas fa-server', text: 'Active services breathe subtly' },
    { icon: 'fas fa-bolt', text: 'Overloaded nodes vibrate slightly' }
  ];

  readonly serviceCategories = [
    {
      name: 'Compute',
      icon: 'fas fa-microchip',
      services: ['EC2', 'Lambda', 'ECS', 'Auto Scaling', 'AWS Batch'],
      costParams: 'instance size, memory, duration, vCPU, concurrency',
      performanceParams: 'throughput, latency, cold starts, capacity'
    },
    {
      name: 'Storage',
      icon: 'fas fa-database',
      services: ['S3', 'EBS', 'Glacier'],
      costParams: 'storage class, capacity, requests, transfer out',
      performanceParams: 'object size, request rate, lifecycle tiering'
    },
    {
      name: 'Database',
      icon: 'fas fa-layer-group',
      services: ['RDS', 'DynamoDB', 'ElastiCache'],
      costParams: 'instance class, read/write capacity, cache allocation',
      performanceParams: 'IOPS, TTL, hit rate, connection pressure'
    },
    {
      name: 'Networking',
      icon: 'fas fa-network-wired',
      services: ['CloudFront', 'Route 53', 'API Gateway', 'ALB'],
      costParams: 'requests, bandwidth, connection minutes, edge transfer',
      performanceParams: 'latency, error rate, throttling, routing'
    },
    {
      name: 'Integration',
      icon: 'fas fa-project-diagram',
      services: ['SQS', 'SNS', 'Step Functions', 'EventBridge'],
      costParams: 'messages, transitions, fan-out, retries',
      performanceParams: 'visibility timeout, batch size, workflow depth'
    },
    {
      name: 'Observability',
      icon: 'fas fa-chart-line',
      services: ['CloudWatch', 'X-Ray', 'Logs'],
      costParams: 'metrics, ingestion, retention, traces',
      performanceParams: 'sampling, alarm volume, log pressure'
    }
  ];

  readonly currencies = ['USD', 'INR', 'EUR', 'JPY'];
}
