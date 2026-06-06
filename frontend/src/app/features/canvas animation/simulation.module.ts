import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationCanvasComponent } from './simulation-canvas.component';

@NgModule({
  imports: [CommonModule, SimulationCanvasComponent],
  exports: [SimulationCanvasComponent],
})
export class SimulationModule {}
