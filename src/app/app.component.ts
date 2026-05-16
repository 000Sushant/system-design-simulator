import { Component } from '@angular/core';
import { SimulatorComponent } from './features/simulator/simulator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SimulatorComponent],
  template: '<app-simulator />'
})
export class AppComponent {}
