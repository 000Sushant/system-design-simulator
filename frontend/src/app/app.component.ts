import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { SimulatorComponent } from './features/simulator/simulator.component';
import { LandingComponent } from './features/landing/landing.component';
import { DocumentationComponent } from './features/documentation/documentation.component';
import { ReportsComponent } from './features/reports/reports.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LandingComponent, SimulatorComponent, DocumentationComponent, ReportsComponent],
  template: `
    @if (reportsOpen) {
      <app-reports />
    } @else if (docsOpen) {
      <app-documentation />
    } @else if (simulatorOpen) {
      <app-simulator />
    } @else {
      <app-landing (launch)="openSimulator($event)" />
    }
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);

  simulatorOpen = false;
  docsOpen = false;
  reportsOpen = false;

  private onPop = () => {
    this.handleRouting();
  };

  ngOnInit(): void {
    this.handleRouting();
    window.addEventListener('popstate', this.onPop);
  }

  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.onPop);
  }

  private handleRouting(): void {
    if (typeof window !== 'undefined' && window.location) {
      const path = window.location.pathname;
      this.reportsOpen = path.startsWith('/benchmarks') || path.startsWith('/reports');
      this.simulatorOpen = path.startsWith('/playground');
      this.docsOpen = path.startsWith('/docs');
    }
  }

  openSimulator(mode?: 'developer' | 'architect'): void {
    const url = mode ? `/playground?mode=${mode}` : '/playground';
    window.history.pushState(null, '', url);
    this.simulatorOpen = true;
    this.docsOpen = false;
    this.reportsOpen = false;
  }
}
