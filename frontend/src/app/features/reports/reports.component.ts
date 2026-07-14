import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

  activeReportId = 'cost-audit';
  navScrolled = false;
  reportHtml: SafeHtml | null = null;
  loading = false;
  private themeSub?: Subscription;
  private loadedReports = new Map<string, string>();

  readonly reportTabs = [
    { id: 'cost-audit', name: 'Cost Accuracy Audit', icon: 'fas fa-shield-halved', src: '/assets/reports/cost-accuracy-benchmark-v5.html' },
    { id: 'engine-deep-dive', name: 'Behavior Engine Deep Dive', icon: 'fas fa-microchip', src: '/assets/reports/engine-deep-dive-pulseflow-rubix.html' },
  ];

  get isDarkMode(): boolean {
    return this.themeService.isDark;
  }

  get activeTab() {
    return this.reportTabs.find(t => t.id === this.activeReportId) || this.reportTabs[0];
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.checkQueryParam();
    this.loadReport();
    window.addEventListener('popstate', this.onPop);
    this.themeSub = this.themeService.isDark$.subscribe(() => {
      // Re-render with updated theme class
      this.renderCurrentReport();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.onPop);
    this.themeSub?.unsubscribe();
    // Clean up injected style tags
    document.querySelectorAll('style[data-report-style]').forEach(el => el.remove());
  }

  private onPop = () => {
    this.checkQueryParam();
    this.loadReport();
  };

  checkQueryParam(): void {
    if (typeof window !== 'undefined' && window.location) {
      const params = new URLSearchParams(window.location.search);
      const reportParam = params.get('report') || params.get('category');
      if (reportParam === 'engine-deep-dive') {
        this.activeReportId = 'engine-deep-dive';
      } else {
        this.activeReportId = 'cost-audit';
      }
    }
  }

  selectReport(id: string): void {
    this.activeReportId = id;
    const url = new URL(window.location.href);
    url.searchParams.set('report', id);
    window.history.replaceState(null, '', url.toString());
    this.loadReport();
    // Scroll content area back to top
    const shell = document.querySelector('.reports-shell');
    if (shell) shell.scrollTop = 0;
  }

  private loadReport(): void {
    const tab = this.activeTab;
    if (this.loadedReports.has(tab.id)) {
      this.renderCurrentReport();
      return;
    }
    this.loading = true;
    this.reportHtml = null;
    this.http.get(tab.src, { responseType: 'text' }).subscribe({
      next: (html) => {
        this.loadedReports.set(tab.id, html);
        this.renderCurrentReport();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private renderCurrentReport(): void {
    const raw = this.loadedReports.get(this.activeReportId);
    if (!raw) return;

    // Extract <style> content
    const styleMatch = raw.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const styleContent = styleMatch ? styleMatch[1] : '';

    // Extract <body> content
    const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let bodyContent = bodyMatch ? bodyMatch[1] : '';

    // Remove the report's own .docs-nav (we use the shell's navbar)
    bodyContent = bodyContent.replace(/<nav[^>]*class="docs-nav"[^>]*>[\s\S]*?<\/nav>/gi, '');

    // Replace all em-dashes with colons to ensure a clean, natural, human-written tone
    bodyContent = bodyContent.replace(/\s*—\s*/g, ': ');

    // Add dynamic premium icons to the PulseFlow and Rubix badges
    bodyContent = bodyContent
      .replace(/<span class="badge b-pulse">PulseFlow<\/span>/g, '<span class="badge b-pulse"><i class="fas fa-wave-square"></i> PulseFlow</span>')
      .replace(/<span class="badge b-rubix">Rubix<\/span>/g, '<span class="badge b-rubix"><i class="fas fa-cube"></i> Rubix</span>');

    let scopedStyle = styleContent
      .replace(/body\.dark\s/g, '.report-content.report-dark ')
      .replace(/body\.dark\{/g, '.report-content.report-dark{')
      .replace(/body\.dark,/g, '.report-content.report-dark,')
      .replace(/body\.light\s/g, '.report-content ')
      .replace(/body\.light\{/g, '.report-content{')
      .replace(/body\s*\{/g, '.report-content {')
      .replace(/body,/g, '.report-content,')
      .replace(/padding-top:\s*96px\s*!important/gi, 'padding-top: 0 !important')
      .replace(/padding:\s*96px\s+/gi, 'padding: 0px ');

    // Neutralize base background styles on .report-content and .report-content.report-dark
    scopedStyle = scopedStyle
      .replace(/\.report-content\.report-dark\s*\{([^}]*?)background:\s*[^;]+?!important/gi, (match, group) => {
        return `.report-content.report-dark {${group}background: transparent !important`;
      })
      .replace(/\.report-content\s*\{([^}]*?)background:\s*[^;]+/gi, (match, group) => {
        return `.report-content {${group}background: transparent`;
      });

    // Inject scoped style into head (remove previous one first)
    const styleId = `report-style-${this.activeReportId}`;
    document.querySelectorAll('style[data-report-style]').forEach(el => el.remove());
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-report-style', styleId);
    styleEl.textContent = scopedStyle;
    document.head.appendChild(styleEl);

    // Build the wrapper with theme class
    const themeClass = this.isDarkMode ? 'report-dark' : '';
    const finalHtml = `<div class="report-content ${themeClass}">${bodyContent}</div>`;
    this.reportHtml = this.sanitizer.bypassSecurityTrustHtml(finalHtml);
  }

  onScroll(event: Event): void {
    const shell = event.currentTarget as HTMLElement;
    this.navScrolled = shell.scrollTop > 60;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  goBack(): void {
    const origin = sessionStorage.getItem('docsOrigin') || '/';
    window.history.pushState(null, '', origin);
    window.dispatchEvent(new Event('popstate'));
  }

  goDocs(event?: Event): void {
    event?.preventDefault();
    sessionStorage.setItem('docsOrigin', '/benchmarks');
    window.history.pushState(null, '', '/docs');
    window.dispatchEvent(new Event('popstate'));
  }

  goHome(event: Event): void {
    event.preventDefault();
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new Event('popstate'));
  }
}
