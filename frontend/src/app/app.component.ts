import { Component, OnDestroy, OnInit } from "@angular/core";
import { SimulatorComponent } from "./features/simulator/simulator.component";
import { LandingComponent } from "./features/landing/landing.component";
import { DocumentationComponent } from "./features/documentation/documentation.component";
import { ThemeService } from "./core/services/theme.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [LandingComponent, SimulatorComponent, DocumentationComponent],
  template: `
    @if (docsOpen) {
      <app-documentation />
    } @else if (simulatorOpen) {
      <app-simulator />
    } @else {
      <app-landing (launch)="openSimulator($event)" />
    }
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  simulatorOpen = false;
  docsOpen = false;

  constructor(private themeService: ThemeService) {}

  private onPop = () => {
    this.simulatorOpen = window.location.pathname.startsWith("/playground");
    this.docsOpen = window.location.pathname.startsWith("/docs");
  };

  ngOnInit(): void {
    this.simulatorOpen = window.location.pathname.startsWith("/playground");
    this.docsOpen = window.location.pathname.startsWith("/docs");
    window.addEventListener("popstate", this.onPop);
  }

  ngOnDestroy(): void {
    window.removeEventListener("popstate", this.onPop);
  }

  openSimulator(mode?: "developer" | "architect"): void {
    const url = mode ? `/playground?mode=${mode}` : "/playground";
    // push a new history entry so Back returns to landing
    window.history.pushState(null, "", url);
    this.simulatorOpen = true;
    this.docsOpen = false;
  }
}
