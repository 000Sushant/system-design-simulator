import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { SimulationCanvasComponent } from "../canvas animation/simulation-canvas.component";

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [CommonModule, SimulationCanvasComponent],
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"],
})
export class LandingComponent {
  @Output() launch = new EventEmitter<"developer" | "architect" | undefined>();
  @ViewChild("shell", { static: true }) shellRef!: ElementRef<HTMLElement>;

  navScrolled = false;

  onShellScroll(event: Event) {
    const el = event.target as HTMLElement;
    this.navScrolled = el.scrollTop > 60;
  }

  onButtonMouseMove(event: MouseEvent) {
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Relative coordinates from center (-1 to 1)
    const rx = (x - rect.width / 2) / (rect.width / 2);
    const ry = (y - rect.height / 2) / (rect.height / 2);
    
    // Cast shadow in opposite direction of mouse
    const shadowX = -rx * 8; // max 8px shift
    const shadowY = -ry * 8; // max 8px shift
    
    btn.style.setProperty('--mouse-x', `${x}px`);
    btn.style.setProperty('--mouse-y', `${y}px`);
    btn.style.setProperty('--shadow-x', `${shadowX}px`);
    btn.style.setProperty('--shadow-y', `${shadowY}px`);
    
    // Calculate gorgeous 3D premium tilt
    const tiltX = ry * 6;  // rotate around X axis
    const tiltY = -rx * 6; // rotate around Y axis
    btn.style.setProperty('--tilt-x', `${tiltX}deg`);
    btn.style.setProperty('--tilt-y', `${tiltY}deg`);
  }

  onButtonMouseLeave(event: MouseEvent) {
    const btn = event.currentTarget as HTMLElement;
    btn.style.removeProperty('--mouse-x');
    btn.style.removeProperty('--mouse-y');
    btn.style.removeProperty('--shadow-x');
    btn.style.removeProperty('--shadow-y');
    btn.style.removeProperty('--tilt-x');
    btn.style.removeProperty('--tilt-y');
  }

  scrollToModes(): void {
    const shell = this.shellRef?.nativeElement;
    if (!shell) return;
    const target = shell.querySelector("#mode-title") as HTMLElement | null;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // fallback: find first mode-section
    const section = shell.querySelector(".mode-section") as HTMLElement | null;
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  readonly trustPills = [
    "Open Source",
    "MIT Licensed",
    "Beta v1.1",
    "Real-time Simulation",
    "AWS Focused",
  ];

  readonly features = [
    {
      icon: "fas fa-diagram-project",
      title: "Design Architectures",
      description:
        "Drag AWS services onto a visual canvas and build real cloud architectures interactively.",
    },
    {
      icon: "fas fa-bolt",
      title: "Real-Time Simulation",
      description:
        "Watch traffic flow through your infrastructure and identify scaling behavior and bottlenecks.",
    },
    {
      icon: "fas fa-chart-line",
      title: "Performance Metrics",
      description:
        "Monitor latency, throughput, failures, request flow, and infrastructure pressure live.",
    },
    {
      icon: "fas fa-sliders",
      title: "Tune & Optimize",
      description:
        "Adjust service configuration, scaling, caching, retries, and capacity dynamically.",
    },
    {
      icon: "fas fa-coins",
      title: "Cost Estimation",
      badge: "Beta",
      description:
        "Generate realistic infrastructure cost approximations based on traffic and architecture configuration.",
    },
    {
      icon: "fas fa-cubes",
      title: "Terraform Import",
      badge: "Coming Soon",
      description:
        "Import HCL/Terraform configurations to automatically construct complete, ready-to-simulate cloud architectures in seconds.",
    },
    {
      icon: "fas fa-wand-magic-sparkles",
      title: "AI Intelligence",
      badge: "Coming Soon",
      description:
        "AI-powered architecture analysis and optimization suggestions.",
    },
    {
      icon: "fas fa-globe",
      title: "Multi-Cloud Support",
      badge: "Coming Soon",
      description: "Compare AWS, Azure, and GCP architecture simulations.",
    },
  ];

  readonly showcaseStats = [
    { label: "Latency", value: "42ms", tone: "cyan" },
    { label: "Req/sec", value: "2.4k", tone: "orange" },
    { label: "Est. Cost", value: "$284", tone: "purple" },
    { label: "Scaling", value: "+3 nodes", tone: "green" },
  ];

  readonly socialLinks = [
    {
      label: "Email",
      icon: "fa fa-envelope",
      href: "mailto:[000susahntkumar@gmail.com]",
    },
    {
      label: "LinkedIn",
      icon: "fab fa-linkedin",
      href: "https://linkedin.com/in/sushant--kumar",
    },
    {
      label: "Portfolio",
      icon: "fas fa-globe",
      href: "https://000sushant.github.io/sushant-portfolio/",
    },
    {
      label: "GitHub",
      icon: "fab fa-github",
      href: "https://github.com/000sushant",
    },
  ];

  readonly modes = [
    {
      id: "developer" as const,
      badge: "Learning Mode",
      title: "Developer",
      description:
        "Learn system design visually through interactive traffic simulation and architecture behavior.",
      button: "Start Learning",
      icon: "fas fa-graduation-cap",
      visual: "developer-visual",
      features: [
        "Guided AWS architecture learning",
        "Simplified service selection",
        "Traffic flow visualization",
        "Real-time bottleneck understanding",
        "Beginner friendly architecture playground",
        "Clean focused experience",
      ],
    },
    {
      id: "architect" as const,
      badge: "Professional Mode",
      title: "Architect",
      description:
        "Design production-scale cloud systems with accurate infrastructure simulation and cost estimation.",
      button: "Design Infrastructure",
      icon: "fas fa-building-columns",
      visual: "architect-visual",
      features: [
        "65+ AWS services",
        "Full architecture freedom",
        "Infrastructure cost estimation",
        "Stress-tested traffic simulation",
        "Performance tuning",
        "Production-focused workflow",
        "Realistic cloud behavior modeling",
      ],
    },
  ];
}
