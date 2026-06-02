import { Component, OnDestroy, OnInit } from "@angular/core";
import { SimulatorComponent } from "./features/simulator/simulator.component";
import { LandingComponent } from "./features/landing/landing.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [LandingComponent, SimulatorComponent],
  template: `
    @if (!simulatorOpen) {
      <app-landing (launch)="openSimulator($event)" />
    } @else {
      <app-simulator />
    }
  `,
})
export class AppComponent {
  simulatorOpen = false;

  private onPop = () => {
    const isPlayground = window.location.pathname.startsWith("/playground");
    this.simulatorOpen = isPlayground;
  };

  ngOnInit(): void {
    this.simulatorOpen = window.location.pathname.startsWith("/playground");
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
  }
}
