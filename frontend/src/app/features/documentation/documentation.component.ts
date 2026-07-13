import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, AfterViewChecked, OnDestroy, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AwsCatalogService } from '../../core/services/aws-catalog.service';
import { AwsServiceDefinition, AwsServiceType } from '../../core/models/architecture.model';
import awsServicesConfig from '../../core/config/aws-services.json';
import serviceDocsData from '../../core/data/service-documentation.json';
import serviceBottleneckData from '../../core/data/service-bottleneck.json';
import { ThemeService } from '../../core/services/theme.service';
import { DocArticle, ReleaseNote, ServiceDoc } from './documentation.types';
import { ARTICLES, RELEASE_NOTES, SERVICE_DOCS } from './documentation-content';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css'],
})
export class DocumentationComponent implements OnInit, AfterViewChecked, OnDestroy {
  private el = inject(ElementRef);
  awsCatalog = inject(AwsCatalogService);
  private sanitizer = inject(DomSanitizer);
  private themeService = inject(ThemeService);

  searchQuery = '';
  activeCategoryId = 'overview';

  readonly categories = [
    { id: 'overview', name: 'Overview', icon: 'fas fa-eye' },
    { id: 'start', name: 'Getting Started', icon: 'fas fa-play' },
    { id: 'engines', name: 'Simulation Engines', icon: 'fas fa-microchip' },
    { id: 'services', name: 'Services', icon: 'fas fa-layer-group' },
    { id: 'sim', name: 'Simulator Core', icon: 'fas fa-bolt' },
    { id: 'formulas', name: 'Formulas & Calculations', icon: 'fas fa-square-root-variable' },
    { id: 'cost', name: 'Cost Dynamics', icon: 'fas fa-coins' },
    { id: 'release-notes', name: 'Release Notes', icon: 'fas fa-rocket' },
    { id: 'contribute', name: 'Ways to Contribute', icon: 'fas fa-hands-helping' },
  ];

  // Version history. v1.1 / v1.2 mirror the README changelog; v1.0 is the
  // foundational release derived from the README's core "Key Highlights".
  readonly releaseNotes: ReleaseNote[] = RELEASE_NOTES;

  // Rendered at the foot of the Release Notes view. Sr. Architect is open
  // source; these are the ways people can help it grow.
  readonly contributionWays = [
    {
      icon: 'fas fa-bullseye',
      accent: 'challenge',
      title: 'Take on the open challenge',
      text: 'A focused, well-scoped challenge is always waiting to be claimed: a tricky simulation edge case, a pricing-accuracy tweak, or a new canvas interaction. A great place for a meaningful first contribution.',
      cta: 'Browse open challenges',
      href: 'https://github.com/000Sushant/system-design-simulator/issues',
    },
    {
      icon: 'fas fa-layer-group',
      accent: 'service',
      title: 'Add a meaningful service',
      text: 'The catalog is fully data-driven, so adding an AWS service is approachable. Describe its real traffic and cost behavior in JSON, give it a custom illustration, and open a PR.',
      cta: 'Contribute on GitHub',
      href: 'https://github.com/000Sushant/system-design-simulator/',
    },
    {
      icon: 'fas fa-graduation-cap',
      accent: 'challenge',
      title: 'Add a new system design challenge',
      text: 'Have a real world problem worth solving? Turn it into a guided challenge with hints, a scoring rubric, and a reference solution. Challenges are defined in JSON, so you can shape the whole learning experience and open a PR.',
      cta: 'Contribute on GitHub',
      href: 'https://github.com/000Sushant/system-design-simulator/',
    },
    {
      icon: 'fas fa-comment-dots',
      accent: 'feedback',
      title: 'Share your feedback',
      text: 'No code required. Send improvement suggestions or tell us about your experience: what clicked and what felt confusing. Every bit shapes where this goes next.',
      cta: 'Share feedback',
      href: 'https://forms.gle/2Kh6TKqcwYUSnYnHA',
    },
    {
      icon: 'fas fa-bug',
      accent: 'bug',
      title: 'Report a bug',
      text: 'Spotted something behaving oddly? Tell us what you did, what you expected, and what happened. A clear report helps enormously and gets fixes shipped faster.',
      cta: 'Report a bug',
      href: 'https://forms.gle/RJwRybjgRPPi11jg7',
    },
    {
      icon: 'fas fa-heart',
      accent: 'sponsor',
      title: 'Sponsor the project',
      text: '100% of every sponsorship goes straight into building Sr. Architect, keeping the pricing pipeline running and shipping new features. Even $1 matters and helps keep things running.',
      cta: 'Become a sponsor',
      href: 'https://github.com/sponsors/000Sushant',
    },
  ];

  readonly articles: DocArticle[] = ARTICLES;

  navScrolled = false;
  showBackToTop = false;
  isManualScrolling = false;
  indicatorStyle: any = { opacity: '0' };

  selectedServiceType: AwsServiceType | null = null;
  inboundNodes: any[] = [];
  outboundNodes: any[] = [];
  rules: any[] = [];

  readonly serviceDocs = SERVICE_DOCS;

  private onPop = () => {
    this.checkQueryParam();
  };

  get isDarkMode(): boolean {
    return this.themeService.isDark;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.checkQueryParam();
    window.addEventListener('popstate', this.onPop);
  }

  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.onPop);
  }

  checkQueryParam(): void {
    if (typeof window !== 'undefined' && window.location) {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get('service');
      const categoryParam = params.get('category');
      if (
        serviceParam &&
        this.awsCatalog.services.some((service) => service.type === serviceParam)
      ) {
        this.selectedServiceType = serviceParam as AwsServiceType;
        this.updateConnectivityMap(serviceParam);
        this.activeCategoryId = '';
      } else if (categoryParam && this.categories.some(c => c.id === categoryParam)) {
        this.activeCategoryId = categoryParam;
        this.selectedServiceType = null;
      } else {
        this.selectedServiceType = null;
      }
    }
  }

  getServiceDoc(type: string): ServiceDoc {
    const defaultInfo = this.awsCatalog.getByType(type as AwsServiceType);
    const custom = this.serviceDocs[type];
    const docData = (serviceDocsData as any)[type] || {};

    const rawService = this.getRawService(type as AwsServiceType);
    const rules = rawService?.rules || [];
    const connectedTargets = rules.slice(0, 4).map((rule: any) => {
      try {
        return this.awsCatalog.getByType(rule.target as AwsServiceType).name;
      } catch {
        return rule.target;
      }
    });

    const rawSvg =
      custom?.illustrationSvg || this.buildServiceIllustration(defaultInfo, connectedTargets);

    // Bottleneck model (what limits this service and whether it throttles or fails).
    const bnRaw = (serviceBottleneckData as any)[type];
    const bottleneck =
      bnRaw && bnRaw.summary
        ? {
          kind: bnRaw.kind,
          failureMode: bnRaw.failureMode,
          capacityDriver: bnRaw.capacityDriver || '',
          summary: bnRaw.summary,
          saturationCondition: bnRaw.saturationCondition || '',
          atSaturation: bnRaw.atSaturation || '',
        }
        : null;

    return {
      whyNeeded: docData.overview || defaultInfo.description,
      beginnerExplanation: docData.conceptualModel || '',
      whenToUse: docData.recommendedUsing || '',
      whenNotToUse: docData.recommendedAvoiding || '',
      practicalExample: docData.practicalScenario || '',
      keyCapabilities: docData.keyCharacteristics || [],
      useCases: docData.commonIntegrationPatterns || [],
      // SAFE: rawSvg is build-time-static — either a hand-authored illustration
      // from the serviceDocs map or buildServiceIllustration() output derived
      // from static service definitions. It must never carry user input.
      illustrationSvg: this.sanitizer.bypassSecurityTrustHtml(rawSvg),
      bottleneck,
    };
  }

  private buildServiceIllustration(
    service: AwsServiceDefinition,
    connectedTargets: string[],
  ): string {
    const color = this.serviceColor(service.type);
    const safeName = this.escapeSvgText(service.name);
    const safeCategory = this.escapeSvgText(service.category);
    const targetA = this.escapeSvgText(connectedTargets[0] || 'Target service');
    const targetB = this.escapeSvgText(connectedTargets[1] || 'Monitoring');

    return `
      <svg viewBox="0 0 400 180" class="illustration-svg" role="img" aria-label="${safeName} architecture flow">
        <defs>
          <linearGradient id="svc-${service.type}-flow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#64748b" stop-opacity="0.7" />
            <stop offset="50%" stop-color="${color}" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#10b981" stop-opacity="0.75" />
          </linearGradient>
        </defs>

        <g transform="translate(58, 90)">
          <rect x="-36" y="-26" width="72" height="52" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
          <text x="0" y="-3" font-size="9" text-anchor="middle" font-weight="800" fill="#475569">REQUEST</text>
          <text x="0" y="11" font-size="8" text-anchor="middle" fill="#64748b">input</text>
        </g>

        <path d="M 96 90 C 135 48, 180 48, 220 90" fill="none" stroke="url(#svc-${service.type}-flow)" stroke-width="2.5" stroke-dasharray="7 5" class="ill-flow-right" />
        <path d="M 96 90 C 135 132, 180 132, 220 90" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4 4" />
        <circle r="5" fill="${color}">
          <animateMotion dur="2.1s" repeatCount="indefinite" path="M 96 90 C 135 48, 180 48, 220 90" />
        </circle>

        <g transform="translate(250, 90)">
          <circle r="34" fill="${color}1f" stroke="${color}" stroke-width="2.5" />
          <circle r="18" fill="#ffffff" stroke="${color}" stroke-width="2" />
          <text x="0" y="4" font-size="9" text-anchor="middle" font-weight="900" fill="#0f172a">${safeName}</text>
          <text x="0" y="50" font-size="8" text-anchor="middle" font-weight="700" fill="#64748b">${safeCategory}</text>
        </g>

        <path d="M 286 76 L 344 48" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4 3" />
        <path d="M 286 104 L 344 132" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4 3" />

        <g transform="translate(354, 48)">
          <rect x="-36" y="-15" width="72" height="30" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" />
          <text x="0" y="4" font-size="8" text-anchor="middle" font-weight="800" fill="#047857">${targetA}</text>
        </g>
        <g transform="translate(354, 132)">
          <rect x="-36" y="-15" width="72" height="30" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
          <text x="0" y="4" font-size="8" text-anchor="middle" font-weight="800" fill="#1d4ed8">${targetB}</text>
        </g>
      </svg>
    `;
  }

  private humanizePort(port: string): string {
    return port
      .replace(/([A-Z])/g, ' $1')
      .replace(/-/g, ' ')
      .toLowerCase();
  }

  private escapeSvgText(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private getRawServices(): any[] {
    const rawData: any = awsServicesConfig;
    return rawData.services || (rawData.default && rawData.default.services) || [];
  }

  private getRawService(type: AwsServiceType): any {
    return this.getRawServices().find((service: any) => service.type === type);
  }

  serviceColor(type: string | null): string {
    if (!type) return '#94a3b8';
    return this.awsCatalog.categoryColor(this.awsCatalog.getByType(type as any).category);
  }

  closeDeepDive(): void {
    this.selectedServiceType = null;
    window.history.pushState(null, '', '/docs');
  }

  updateConnectivityMap(type: string): void {
    const rawData: any = awsServicesConfig;
    const services = rawData.services || (rawData.default && rawData.default.services) || [];

    // Find this service rules
    const thisService = services.find((s: any) => s.type === type);
    this.rules =
      thisService?.rules?.map((r: any) => {
        const targetDef = this.awsCatalog.getByType(r.target);
        return {
          target: r.target,
          targetName: targetDef.name,
          type: r.type,
          description: r.description,
        };
      }) || [];

    // Find outbound services
    const allowedTargets = thisService?.rules?.map((r: any) => r.target) || [];
    const outboundList = services
      .filter((s: any) => allowedTargets.includes(s.type))
      .map((s: any) => {
        const def = this.awsCatalog.getByType(s.type);
        return { name: def.name, iconUrl: def.iconUrl };
      })
      .slice(0, 4);

    // Find inbound services
    const inboundList = services
      .filter((s: any) => {
        return s.rules?.some((r: any) => r.target === type);
      })
      .map((s: any) => {
        const def = this.awsCatalog.getByType(s.type);
        return { name: def.name, iconUrl: def.iconUrl };
      })
      .slice(0, 4);

    this.inboundNodes = this.getNodesWithY(inboundList);
    this.outboundNodes = this.getNodesWithY(outboundList);
  }

  getNodesWithY(nodesList: any[], startY = 40, endY = 260): any[] {
    const count = nodesList.length;
    if (count === 0) return [];
    if (count === 1) return [{ name: nodesList[0].name, iconUrl: nodesList[0].iconUrl, y: 150 }];

    const step = (endY - startY) / (count - 1);
    return nodesList.map((node, i) => ({
      name: node.name,
      iconUrl: node.iconUrl,
      y: startY + i * step,
    }));
  }

  ngAfterViewChecked(): void {
    this.updateIndicator();
  }

  updateIndicator(): void {
    const activeBtn = this.el.nativeElement.querySelector('.category-btn.active');
    if (activeBtn) {
      const parent = activeBtn.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const rect = activeBtn.getBoundingClientRect();
        const left = rect.left - parentRect.left;
        const top = rect.top - parentRect.top;

        const newStyle = {
          transform: `translate3d(${left}px, ${top}px, 0)`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          opacity: '1',
        };

        if (
          this.indicatorStyle.transform !== newStyle.transform ||
          this.indicatorStyle.width !== newStyle.width ||
          this.indicatorStyle.height !== newStyle.height ||
          this.indicatorStyle.opacity !== newStyle.opacity
        ) {
          Promise.resolve().then(() => {
            this.indicatorStyle = newStyle;
          });
        }
      }
    } else {
      if (this.indicatorStyle.opacity !== '0') {
        Promise.resolve().then(() => {
          this.indicatorStyle = { opacity: '0' };
        });
      }
    }
  }

  get displayedCategories() {
    return this.categories.filter((cat) => {
      if (cat.id === 'services') {
        return this.filteredServices.length > 0;
      }
      if (cat.id === 'release-notes') {
        return this.filteredReleaseNotes.length > 0;
      }
      if (cat.id === 'contribute') {
        return this.filteredContributionWays.length > 0;
      }
      return this.getArticlesByCategory(cat.id).length > 0;
    });
  }

  get filteredContributionWays() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.contributionWays;
    }
    return this.contributionWays.filter(
      (way) =>
        way.title.toLowerCase().includes(query) ||
        way.text.toLowerCase().includes(query) ||
        way.cta.toLowerCase().includes(query),
    );
  }

  get filteredReleaseNotes(): ReleaseNote[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.releaseNotes;
    }
    return this.releaseNotes.filter(
      (rel) =>
        rel.version.includes(query) ||
        rel.title.toLowerCase().includes(query) ||
        rel.summary.toLowerCase().includes(query) ||
        rel.items.some((i) => i.text.toLowerCase().includes(query)),
    );
  }

  get filteredServices(): AwsServiceDefinition[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.awsCatalog.services;
    }

    return this.awsCatalog.services.filter((service) => {
      const doc = this.getServiceDoc(service.type);
      return (
        service.name.toLowerCase().includes(query) ||
        service.type.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        doc.whyNeeded.toLowerCase().includes(query) ||
        doc.practicalExample.toLowerCase().includes(query)
      );
    });
  }

  get serviceDirectoryGroups(): Array<{ category: string; services: AwsServiceDefinition[] }> {
    const groups = new Map<string, AwsServiceDefinition[]>();
    for (const service of this.filteredServices) {
      const list = groups.get(service.category) || [];
      list.push(service);
      groups.set(service.category, list);
    }

    return [...groups.entries()].map(([category, services]) => ({ category, services }));
  }

  getArticlesByCategory(categoryId: string): DocArticle[] {
    const query = this.searchQuery.trim().toLowerCase();
    let list = this.articles.filter((a) => a.category === categoryId);

    if (query) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.summary.toLowerCase().includes(query) ||
          a.content.some((c) => c.toLowerCase().includes(query)),
      );
    }
    return list;
  }

  openServiceDoc(type: string): void {
    if (!this.awsCatalog.services.some((service) => service.type === type)) {
      return;
    }

    this.selectedServiceType = type as AwsServiceType;
    this.updateConnectivityMap(type);
    window.history.pushState(null, '', `/docs?service=${type}`);
    this.activeCategoryId = '';

    const shell = this.el.nativeElement.querySelector('.docs-shell');
    shell?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onScroll(event: Event): void {
    const shell = event.target as HTMLElement;
    this.navScrolled = shell.scrollTop > 60;
    this.showBackToTop = shell.scrollTop > 400;

    if (this.isManualScrolling) return;

    const sections = shell.querySelectorAll('.docs-category-section');
    let currentActiveId = 'overview';
    const threshold = 160;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i] as HTMLElement;
      const rect = section.getBoundingClientRect();
      if (rect.top <= threshold + 40) {
        const id = section.id.replace('section-', '');
        currentActiveId = id;
      }
    }

    if (shell.scrollTop < 100) {
      currentActiveId = 'overview';
    }

    if (this.activeCategoryId !== currentActiveId) {
      this.activeCategoryId = currentActiveId;
    }
  }

  selectCategory(id: string): void {
    const wasServiceOpen = this.selectedServiceType !== null;
    if (wasServiceOpen) {
      this.selectedServiceType = null;
      window.history.pushState(null, '', '/docs');
    }
    this.activeCategoryId = id;
    window.history.pushState(null, '', `/docs?category=${id}`);

    this.isManualScrolling = true;

    const performScroll = () => {
      const shell = this.el.nativeElement.querySelector('.docs-shell');
      if (id === 'overview') {
        shell.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => (this.isManualScrolling = false), 800);
      } else {
        const targetSection = this.el.nativeElement.querySelector(`#section-${id}`);
        if (targetSection && shell) {
          const shellRect = shell.getBoundingClientRect();
          const targetRect = targetSection.getBoundingClientRect();
          const scrollTop = shell.scrollTop;
          const targetTop = targetRect.top + scrollTop - shellRect.top - 88;

          shell.scrollTo({ top: targetTop, behavior: 'smooth' });
          setTimeout(() => (this.isManualScrolling = false), 800);
        } else {
          this.isManualScrolling = false;
        }
      }
    };

    if (wasServiceOpen) {
      setTimeout(performScroll, 50);
    } else {
      performScroll();
    }
  }

  backToServices(): void {
    this.selectCategory('services');
  }

  scrollToTop(): void {
    const shell = this.el.nativeElement.querySelector('.docs-shell');
    shell?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Back returns to wherever docs was opened from: the playground if the user
   *  came from there, otherwise the landing page. The origin is stashed in
   *  sessionStorage by the opener (survives docs' own internal URL updates). */
  goBack(): void {
    const target = sessionStorage.getItem('docsOrigin') === '/playground' ? '/playground' : '/';
    window.history.pushState(null, '', target);
    window.dispatchEvent(new Event('popstate'));
  }

  /** The logo always returns to the landing page. */
  goHome(event: Event): void {
    event.preventDefault();
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new Event('popstate'));
  }

}
