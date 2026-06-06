# Simulation Canvas – 3D Three.js (Angular)

## Setup

### 1. Install Three.js
```bash
npm install three
npm install --save-dev @types/three
```

### 2. Add files to your project
Copy these files into your Angular project:
```
src/app/simulation/
  simulation-canvas.component.ts
  simulation-canvas.component.html
  simulation-canvas.component.scss
  simulation.module.ts
```

### 3. Import the module
In your `app.module.ts` (or any feature module):
```ts
import { SimulationModule } from './simulation/simulation.module';

@NgModule({
  imports: [SimulationModule],
})
export class AppModule {}
```

### 4. Use the component
```html
<app-simulation-canvas></app-simulation-canvas>
```

---

## What's included

| Feature | Detail |
|---|---|
| 3D nodes | Metallic spheres with dual orbital rings per node |
| Glow lighting | Colored point lights at each node position |
| Data packets | Animated spheres traveling along Bezier curves |
| Packet trails | Point-cloud trails following each packet |
| Mac browser chrome | Traffic lights, URL bar, toolbar buttons |
| Dotted grid | GridHelper + random dots as sketchbook floor |
| Orbit controls | Drag, zoom, auto-rotate with damping |
| Metrics overlay | Live-looking metrics panel |
| Node legend | Color-coded node list |

## Customization

### Change node positions
In the component TS, edit the `nodes` array `position` fields (THREE.Vector3).

### Change edge colors / labels
Edit the `edges` array — each edge has `from`, `to`, `color` (hex), and `label`.

### Packet speed
Each packet gets `speed: 0.003 + Math.random() * 0.002`. Increase for faster flow.

### Add more nodes
Push new entries to `nodes[]` and new entries to `edges[]` referencing the new index.

### Background color
Change `this.scene.background = new THREE.Color(0x0d1117)` to any hex.

## Angular version compatibility
Tested with Angular 14+. Uses `NgZone.runOutsideAngular` to keep Three.js rendering
off Angular's change detection cycle for maximum performance.
