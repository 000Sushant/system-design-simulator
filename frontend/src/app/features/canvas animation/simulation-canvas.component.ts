import { Component, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";

interface NodeInfo {
  id: string;
  name: string;
  label: string;
  sublabel: string;
  color: string;
  icon: string;
  position: { left: string; top: string };
}

interface LogItem {
  timestamp: string;
  service: "GATEWAY" | "EC2" | "RDS" | "CLIENT";
  message: string;
  status: "info" | "warn" | "success";
}

@Component({
  selector: "app-simulation-canvas",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./simulation-canvas.component.html",
  styleUrls: ["./simulation-canvas.component.scss"],
})
export class SimulationCanvasComponent implements OnDestroy {
  public tiltStyle =
    "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  public tiltTransition = "transform 0.6s cubic-bezier(0.25,1,0.5,1)";

  metrics = {
    latency: 24,
    rps: 142,
    errors: "0.02%",
    pool: "8/20",
    uptime: "99.98%",
    cpu: 62,
  };

  nodes: NodeInfo[] = [
    {
      id: "gateway",
      name: "api gateway",
      label: "API Gateway",
      sublabel: "REST router",
      color: "#34d399", // Premium Emerald
      icon: "fas fa-network-wired",
      position: { left: "50%", top: "33.33%" },
    },
    {
      id: "client",
      name: "client",
      label: "Users",
      sublabel: "web & mobile",
      color: "#38bdf8", // Electric Blue
      icon: "fas fa-mobile-alt",
      position: { left: "25%", top: "54.16%" },
    },
    {
      id: "server",
      name: "ec2 cluster",
      label: "Backend",
      sublabel: "auto-scaled",
      color: "#fbbf24", // Premium Amber
      icon: "fas fa-server",
      position: { left: "75%", top: "54.16%" },
    },
    {
      id: "database",
      name: "rds cluster",
      label: "Database",
      sublabel: "primary write",
      color: "#a78bfa", // Violet
      icon: "fas fa-database",
      position: { left: "50%", top: "75%" },
    },
  ];

  logs: LogItem[] = [];
  sparklinePath = "";
  sparklineHistory: number[] = [];

  private intervalId: any;

  constructor() {
    // Pre-populate history
    this.sparklineHistory = [
      24, 28, 25, 30, 22, 26, 28, 24, 27, 25, 29, 23, 26, 28, 24,
    ];
    this.generateSparkline();

    // Pre-populate logs with mock traffic
    for (let i = 0; i < 4; i++) {
      this.addLog();
    }

    this.intervalId = setInterval(() => {
      this.metrics.latency = 20 + Math.floor(Math.random() * 10);
      this.metrics.rps = 130 + Math.floor(Math.random() * 20);

      // Update sparkline
      this.sparklineHistory.push(this.metrics.latency);
      this.sparklineHistory.shift();
      this.generateSparkline();

      // Update dynamic indicators
      this.metrics.cpu = 45 + Math.floor(Math.random() * 25);
      this.metrics.pool = `${6 + Math.floor(Math.random() * 6)}/20`;

      // Log additions
      if (Math.random() > 0.2) {
        this.addLog();
      }
    }, 1800);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  generateSparkline(): void {
    const width = 120;
    const height = 30;
    const padding = 2;
    const pointsCount = this.sparklineHistory.length;

    const minVal = Math.min(...this.sparklineHistory);
    const maxVal = Math.max(...this.sparklineHistory);
    const valRange = maxVal - minVal || 1;

    let path = "";
    for (let i = 0; i < pointsCount; i++) {
      const x = (i / (pointsCount - 1)) * width;
      const normalized = (this.sparklineHistory[i] - minVal) / valRange;
      const y = height - padding - normalized * (height - 2 * padding);
      if (i === 0) {
        path += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      } else {
        path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
    }
    this.sparklinePath = path;
  }

  addLog(): void {
    const ips = [
      "192.168.1.45",
      "172.16.0.84",
      "203.0.113.12",
      "198.51.100.5",
      "192.168.2.14",
    ];
    const selectedIp = ips[Math.floor(Math.random() * ips.length)];
    const hex = Math.floor(Math.random() * 65535)
      .toString(16)
      .toUpperCase();
    const lat = this.metrics.latency;

    const templates: LogItem[] = [
      {
        timestamp: this.getTimestamp(),
        service: "GATEWAY",
        message: `GET /api/v1/feed - 200 OK - ${lat}ms (IP: ${selectedIp})`,
        status: "success",
      },
      {
        timestamp: this.getTimestamp(),
        service: "GATEWAY",
        message: `POST /api/v1/posts - 201 Created (IP: ${selectedIp})`,
        status: "success",
      },
      {
        timestamp: this.getTimestamp(),
        service: "EC2",
        message: `ASG scale-up checked (CPU: ${this.metrics.cpu}%)`,
        status: "warn",
      },
      {
        timestamp: this.getTimestamp(),
        service: "RDS",
        message: `Committed txn #0x${hex} in ${2 + Math.floor(Math.random() * 4)}ms`,
        status: "success",
      },
      {
        timestamp: this.getTimestamp(),
        service: "RDS",
        message: `Syncing Read Replica #1 (lag: 0.14ms)`,
        status: "info",
      },
      {
        timestamp: this.getTimestamp(),
        service: "GATEWAY",
        message: `Resolved endpoint routing to EC2 pool`,
        status: "info",
      },
      {
        timestamp: this.getTimestamp(),
        service: "EC2",
        message: `Node-03 healthy - CPU: ${Math.floor(30 + Math.random() * 35)}%`,
        status: "success",
      },
      {
        timestamp: this.getTimestamp(),
        service: "GATEWAY",
        message: `GET /static/bundle.js - 304 Cache Hit`,
        status: "info",
      },
      {
        timestamp: this.getTimestamp(),
        service: "CLIENT",
        message: `WebSocket session active`,
        status: "success",
      },
    ];

    const newLog = templates[Math.floor(Math.random() * templates.length)];
    this.logs.push(newLog);
    if (this.logs.length > 4) {
      this.logs.shift();
    }
  }

  getTimestamp(): string {
    const now = new Date();
    const hrs = now.getHours().toString().padStart(2, "0");
    const mins = now.getMinutes().toString().padStart(2, "0");
    const secs = now.getSeconds().toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  }

  onMouseMove(event: MouseEvent): void {
    const wrapper = event.currentTarget as HTMLElement;
    const rect = wrapper.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    this.tiltTransition = "transform 0.15s cubic-bezier(0.25,1,0.5,1)";
    const rotX = (-y * 5).toFixed(2);
    const rotY = (x * 6).toFixed(2);
    this.tiltStyle =
      "perspective(1200px) rotateX(" +
      rotX +
      "deg) rotateY(" +
      rotY +
      "deg) scale3d(1.015,1.015,1.015)";
  }

  onMouseLeave(): void {
    this.tiltTransition = "transform 0.6s cubic-bezier(0.25,1,0.5,1)";
    this.tiltStyle =
      "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }
}
