# Sr. Architect — Brand Kit

The logo is a triangle of three connected nodes. The three node colors map to the
clouds the simulator targets, so the multi-cloud story is built into the mark:

| Node | Color | Hex | Cloud |
|---|---|---|---|
| Top | Orange | `#ff9900` | AWS |
| Bottom-left | Blue | `#4aa3f0` | Azure |
| Bottom-right | Green | `#2bbf7a` | GCP |

Surface and ink:

| Token | Hex | Use |
|---|---|---|
| Ink | `#1b2330` | Dark tile, dark-mode text |
| Paper | `#fff7e7` | Light tile, light-mode mark on dark |

Wordmark typeface: **Plus Jakarta Sans** — `Sr.` at weight 700, `Architect` at weight
500, the period in AWS orange. This matches the app UI font, so the lockup renders
natively in-product with no extra font loading.

## Which file goes where

All vector sources live here. Rasters are generated from them (see *Regenerating*).

### Vector (preferred — scales to any size)

There is **one primary mark — T1 (dark tile)** — used everywhere: favicon, navbar,
app tile, social. It is a self-contained dark tile with a hairline border, so it stays
legible on white, gray, slate, and near-black surfaces. The light and mono marks are
*alternates* for specific situations, not defaults.

| File | Role | Use it for |
|---|---|---|
| `logo-mark-dark.svg` (T1) | **Primary** | The mark, everywhere. Favicon, navbar, app icon, social. Works on any background. |
| `logo-mark-light.svg` (T2) | Alternate | Only when placing the mark on a **light** surface where you want a light tile (e.g. a printed page). Not the default. |
| `logo-mark-mono.svg` | Alternate | One-color contexts — uses `currentColor`, so it inherits text color. Watermarks, print, embossing, single-ink stamps. |
| `logo-lockup-dark.svg` | Lockup | Mark + wordmark on dark backgrounds. Headers, slide title pages, dark email signatures. |
| `logo-lockup-light.svg` | Lockup | Mark + wordmark on light backgrounds. Docs, letterhead, light decks. |
| `../../favicon.svg` | Favicon | Single fixed T1 mark for the browser tab and bookmarks. |

Wordmark text in product (the navbar `Sr. Architect`) flips ink ↔ cream by theme for
legibility — that is a text-color swap handled by the app's `.dark` class, not a second
logo.

### Raster (for places that can't take SVG)

| File | Size | Use it for |
|---|---|---|
| `favicon-16.png` | 16×16 | Legacy favicon slot |
| `favicon-32.png` | 32×32 | Browser tab / bookmark fallback |
| `favicon-48.png` | 48×48 | Windows taskbar / shortcut |
| `../../favicon.ico` | 16/32/48 | Old-browser and Windows `.ico` fallback (auto-requested at `/favicon.ico`) |
| `apple-touch-icon.png` | 180×180 | iOS home-screen icon |
| `icon-192.png` | 192×192 | PWA / Android home screen |
| `icon-512.png` | 512×512 | PWA splash, app stores, high-DPI |
| `icon-maskable-512.png` | 512×512 | Android adaptive (maskable) icon |
| `og-image.png` | 1200×630 | Social share card (Open Graph / Twitter) |

All raster icons use **T1 (dark tile)** because the bright nodes stay legible on any
browser chrome, light or dark. They are wired up in `frontend/src/index.html` and
`site.webmanifest`.

## Resolution rule of thumb

- **Anywhere you can use SVG, use SVG.** It is the master and never blurs.
- Need raster? Pick the **next size up** from the display size and let it scale down,
  never up. A 24px UI slot → use `favicon-32.png`. A 64px tile → use `icon-192.png`.
- Print: export from the SVG at 300 DPI in your design tool. Do not upscale a PNG.

## Clear space and minimum size

- Keep clear space around the mark equal to one node diameter on all sides.
- Minimum legible size: **16px** for the mark, **96px** wide for the full lockup.
  Below the lockup minimum, drop the wordmark and use the mark alone.

## Don't

- Don't recolor the nodes (they encode AWS / Azure / GCP).
- Don't add shadows, gradients, or glow — the brand is flat.
- Don't put the dark-tile mark on a dark background, or the light-tile mark on a light
  background. Use the mono mark if you need it to sit directly on a colored surface.
- Don't stretch, rotate, or re-space the wordmark.

## Regenerating the raster assets

Rasters are built from the SVG masters by `frontend/scripts/generate-brand-assets.mjs`
(`sharp` and `png-to-ico` are already pinned in `frontend/package.json` devDependencies):

```bash
cd frontend
npm install
node scripts/generate-brand-assets.mjs
```

Edit the SVG, rerun, done. The script only reads `logo-mark-dark.svg`, so the mark
geometry has a single source of truth.
