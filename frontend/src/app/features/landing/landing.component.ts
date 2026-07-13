import {
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { SimulationCanvasComponent } from '../canvas animation/simulation-canvas.component';
import { ThemeService } from '../../core/services/theme.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [SimulationCanvasComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private zone = inject(NgZone);
  private scrollTicking = false;
  private readonly onScrollBound = (): void => this.handleScroll();

  @Output() launch = new EventEmitter<'developer' | 'architect' | undefined>();
  @ViewChild('shell', { static: true }) shellRef!: ElementRef<HTMLElement>;

  /** Live project stats from the Worker. Null until loaded; hidden if it stays null. */
  liveStats: { icon: string; value: string; label: string }[] | null = null;
  githubStars: string | null = null;

  ngOnInit(): void {
    this.loadLiveStats();
    // Attach the scroll listener outside Angular so the pill's collapse/expand
    // transition isn't fighting a full change-detection pass on every frame.
    // We only re-enter Angular (and trigger CD) on the frame a bound flag flips.
    this.zone.runOutsideAngular(() => {
      this.shellRef.nativeElement.addEventListener('scroll', this.onScrollBound, { passive: true });
    });
  }

  ngOnDestroy(): void {
    this.shellRef.nativeElement.removeEventListener('scroll', this.onScrollBound);
  }

  private async loadLiveStats(): Promise<void> {
    const base = (environment as { dailyApiBase?: string }).dailyApiBase;
    if (base) {
      try {
        const res = await fetch(`${base}/stats`);
        if (res.ok) {
          const s = await res.json();
          // Only show the strip once there is something real to show.
          if (s && (s.stars || s.clones || s.visitors)) {
            this.liveStats = this.toStats(s);
            return;
          }
        }
      } catch {
        // Network/Worker unavailable: fall through to the dev fallback below.
      }
    }
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      this.liveStats = this.toStats({ stars: 12, clones: 340, visitors: 1200, countries: 28 });
    }
  }

  private toStats(s: { stars: number; clones: number; visitors: number; countries: number }) {
    this.githubStars = this.formatCount(s.stars);
    return [
      { icon: 'fas fa-star', value: this.formatCount(s.stars), label: 'GitHub Stars' },
      { icon: 'fas fa-download', value: this.formatCount(s.clones), label: 'Clones' },
      { icon: 'fas fa-eye', value: this.formatCount(s.visitors), label: 'Visitors' },
      { icon: 'fas fa-earth-americas', value: this.formatCount(s.countries), label: 'Countries' },
    ];
  }

  private formatCount(n: number): string {
    if (!n || n < 0) return '0';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  readonly contributors = [
    {
      login: '000Sushant',
      avatar_url: 'https://github.com/000Sushant.png',
      html_url: 'https://github.com/000Sushant',
    },
    {
      login: 'harsh-dwivedi',
      avatar_url: 'https://github.com/harsh-dwivedi.png',
      html_url: 'https://github.com/harsh-dwivedi',
    },
  ];

  get isDarkMode(): boolean {
    return this.themeService.isDark;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  navScrolled = false;
  showBackToTop = false;

  private handleScroll(): void {
    // rAF-coalesce: at most one read per frame regardless of scroll event rate.
    if (this.scrollTicking) return;
    this.scrollTicking = true;
    requestAnimationFrame(() => {
      this.scrollTicking = false;
      const top = this.shellRef.nativeElement.scrollTop;
      const navScrolled = top > 60;
      const showBackToTop = top > 400;
      // Nothing bound changed -> stay outside Angular, no change detection.
      if (navScrolled === this.navScrolled && showBackToTop === this.showBackToTop) return;
      // A flag flipped -> re-enter Angular so the template updates the class.
      this.zone.run(() => {
        this.navScrolled = navScrolled;
        this.showBackToTop = showBackToTop;
      });
    });
  }

  scrollToTop(): void {
    this.shellRef.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openDocs(event: Event) {
    event.preventDefault();
    // Record origin so the docs "Back" button returns here.
    sessionStorage.setItem('docsOrigin', '/');
    window.history.pushState(null, '', '/docs');
    window.dispatchEvent(new Event('popstate'));
  }

  openReport(reportId: string, event: Event) {
    event?.preventDefault();
    // Record origin so the reports page "Back" button returns to the landing page.
    sessionStorage.setItem('docsOrigin', '/');
    window.history.pushState(null, '', `/benchmarks?report=${reportId}`);
    window.dispatchEvent(new Event('popstate'));
  }

  onButtonMouseMove(event: MouseEvent) {
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Relative coordinates from center (-1 to 1)
    const rx = (x - rect.width / 2) / (rect.width / 2);
    const ry = (y - rect.height / 2) / (rect.height / 2);

    // Max rotation in degrees
    const maxRotation = 6;
    const tiltX = -ry * maxRotation;
    const tiltY = rx * maxRotation;

    // Shift shadows slightly
    const shadowX = rx * 8;
    const shadowY = ry * 8;

    btn.style.setProperty('--mouse-x', `${x}px`);
    btn.style.setProperty('--mouse-y', `${y}px`);
    btn.style.setProperty('--shadow-x', `${shadowX}px`);
    btn.style.setProperty('--shadow-y', `${shadowY}px`);
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
    const target = shell.querySelector('#mode-title') as HTMLElement | null;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // fallback: find first mode-section
    const section = shell.querySelector('.mode-section') as HTMLElement | null;
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  readonly trustPills = [
    'Open Source',
    'GNU GPLv3 Licensed',
    '10+ System Design Challenges',
    'Live Cost Analytics',
    'Real-time Simulation',
  ];

  readonly features = [
    {
      icon: 'fas fa-graduation-cap',
      title: 'Design Challenges',
      badge: 'New',
      description:
        'Learn system design by solving real world problems. Guided hints, live scoring, and reference solutions that explain the why behind every decision.',
    },
    {
      icon: 'fas fa-diagram-project',
      title: 'Design Architectures',
      description:
        'Shape real AWS architectures on a visual canvas. Every service, connection, and parameter at your fingertips.',
    },
    {
      icon: 'fas fa-bolt',
      title: 'Real-Time Simulation',
      description:
        'Watch live traffic flow through every node and see bottlenecks surface before your users ever could.',
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Performance Metrics',
      description:
        'Per-node RPS, latency, utilization, and failures, all streamed live while your system runs.',
    },
    {
      icon: 'fas fa-sliders',
      title: 'Tune & Optimize',
      description:
        'Explore scaling, caching, retries, and capacity freely, with every adjustment reflected in real time.',
    },
    {
      icon: 'fas fa-coins',
      title: 'Cost Analytics',
      description:
        'A live cost dashboard with real AWS pricing behind every node. Your whole architecture priced as you design, so you can defend every dollar.',
    },
    {
      icon: 'fas fa-rocket',
      title: 'Sr. Architect 2.0',
      badge: 'Coming Soon',
      description:
        'The next chapter of Sr. Architect. with AI powerd engine, Terraform import, multi-cloud support across AWS, Azure, and GCP, and much more.',
    },
  ];

  readonly showcaseStats = [
    { label: 'Latency', value: '42ms', tone: 'cyan' },
    { label: 'Req/sec', value: '2.4k', tone: 'orange' },
    { label: 'Est. Cost', value: '$284', tone: 'purple' },
    { label: 'Scaling', value: '+3 nodes', tone: 'green' },
  ];

  readonly socialLinks = [
    {
      label: 'Email',
      icon: 'fa fa-envelope',
      href: 'mailto:[000susahntkumar@gmail.com]',
    },
    {
      label: 'LinkedIn',
      icon: 'fab fa-linkedin',
      href: 'https://linkedin.com/in/sushant--kumar',
    },
    {
      label: 'Portfolio',
      icon: 'fas fa-globe',
      href: 'https://000sushant.github.io/sushant-portfolio/',
    },
    {
      label: 'GitHub',
      icon: 'fab fa-github',
      href: 'https://github.com/000Sushant',
    },
  ];

  readonly modes = [
    {
      id: 'developer' as const,
      badge: 'Learn System Design',
      title: 'Developer',
      description:
        'Learn system design by doing. Take on real world challenges, follow guided hints, and watch your architecture come alive as you build it.',
      button: 'Start Learning',
      icon: 'fas fa-graduation-cap',
      visual: 'developer-visual',
      features: [
        'Guided system design challenges',
        'Real interview style problems',
        'Step by step hints and milestones',
        'Instant scoring and feedback',
        'Reference solutions that explain every choice',
        'Beginner friendly documentation on each service',
      ],
    },
    {
      id: 'architect' as const,
      badge: 'Design + Cost Analytics',
      title: 'Architect',
      description:
        'Model production grade systems with 70+ AWS services and a live cost analytics dashboard that turns your design into a monthly bill you can defend.',
      button: 'Design Infrastructure',
      icon: 'fas fa-building-columns',
      visual: 'architect-visual',
      features: [
        '70+ real AWS services',
        '25+ real AWS regions with precise pricing',
        'Live cost analytics dashboard',
        'Accurate per service monthly estimates',
        'Stress test production workloads',
        'Granular performance tuning',
      ],
    },
  ];
}
