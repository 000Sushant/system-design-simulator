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
  showBackToTop = false;

  onShellScroll(event: Event) {
    const el = event.target as HTMLElement;
    this.navScrolled = el.scrollTop > 60;
    this.showBackToTop = el.scrollTop > 400;
  }

  scrollToTop(): void {
    this.shellRef.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openDocs(event: Event) {
    event.preventDefault();
    window.history.pushState(null, "", "/docs");
    window.dispatchEvent(new Event("popstate"));
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

    btn.style.setProperty("--mouse-x", `${x}px`);
    btn.style.setProperty("--mouse-y", `${y}px`);
    btn.style.setProperty("--shadow-x", `${shadowX}px`);
    btn.style.setProperty("--shadow-y", `${shadowY}px`);

    // Subtle 3D tilt
    const tiltX = ry * 4; // rotate around X axis
    const tiltY = -rx * 4; // rotate around Y axis
    btn.style.setProperty("--tilt-x", `${tiltX}deg`);
    btn.style.setProperty("--tilt-y", `${tiltY}deg`);
  }

  onButtonMouseLeave(event: MouseEvent) {
    const btn = event.currentTarget as HTMLElement;
    btn.style.removeProperty("--mouse-x");
    btn.style.removeProperty("--mouse-y");
    btn.style.removeProperty("--shadow-x");
    btn.style.removeProperty("--shadow-y");
    btn.style.removeProperty("--tilt-x");
    btn.style.removeProperty("--tilt-y");
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
    "10+ System Design Challenges",
    "Live Cost Analytics",
    "Real-time Simulation",
  ];

  readonly features = [
    {
      icon: "fas fa-graduation-cap",
      title: "System Design Challenges",
      badge: "New",
      description:
        "Learn system design by solving real world problems. Guided hints, live scoring, and reference solutions that explain the why behind every decision.",
    },
    {
      icon: "fas fa-diagram-project",
      title: "Design Architectures",
      description:
        "Shape real AWS architectures on a visual canvas. Every service, connection, and parameter at your fingertips.",
    },
    {
      icon: "fas fa-bolt",
      title: "Real-Time Simulation",
      description:
        "Watch live traffic flow through every node and see bottlenecks surface before your users ever could.",
    },
    {
      icon: "fas fa-chart-line",
      title: "Performance Metrics",
      description:
        "Per-node RPS, latency, utilization, and failures, all streamed live while your system runs.",
    },
    {
      icon: "fas fa-sliders",
      title: "Tune & Optimize",
      description:
        "Explore scaling, caching, retries, and capacity freely, with every adjustment reflected in real time.",
    },
    {
      icon: "fas fa-coins",
      title: "Cost Analytics",
      description:
        "A live cost dashboard with real AWS pricing behind every node. Your whole architecture priced as you design, so you can defend every dollar.",
    },
    {
      icon: "fas fa-cubes",
      title: "Terraform Import",
      badge: "Coming Soon",
      description:
        "Drop in your HCL and get a running, simulation-ready replica of your infrastructure in seconds.",
    },
    {
      icon: "fas fa-wand-magic-sparkles",
      title: "AI Intelligence",
      badge: "Coming Soon",
      description:
        "An AI architect that reviews your design and flags weaknesses before production does.",
    },
    {
      icon: "fas fa-globe",
      title: "Multi-Cloud Support",
      badge: "Coming Soon",
      description:
        "One canvas for AWS, Azure, and GCP to compare the same architecture across clouds.",
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
      href: "https://github.com/000Sushant",
    },
  ];

  readonly modes = [
    {
      id: "developer" as const,
      badge: "Learn System Design",
      title: "Developer",
      description:
        "Learn system design by doing. Take on real world challenges, follow guided hints, and watch your architecture come alive as you build it.",
      button: "Start Learning",
      icon: "fas fa-graduation-cap",
      visual: "developer-visual",
      features: [
        "Guided system design challenges",
        "Real interview style problems",
        "Step by step hints and milestones",
        "Instant scoring and feedback",
        "Reference solutions that explain every choice",
      ],
    },
    {
      id: "architect" as const,
      badge: "Design + Cost Analytics",
      title: "Architect",
      description:
        "Model production grade systems with 60+ AWS services and a live cost analytics dashboard that turns your design into a monthly bill you can defend.",
      button: "Design Infrastructure",
      icon: "fas fa-building-columns",
      visual: "architect-visual",
      features: [
        "60+ real AWS services",
        "Live cost analytics dashboard",
        "Accurate per service monthly estimates",
        "Stress test production workloads",
        "Granular performance tuning",
      ],
    },
  ];
}
