// Regenerates all raster brand assets from the master SVG marks.
// Usage: cd frontend && npm i && node scripts/generate-brand-assets.mjs
// Tools: sharp, png-to-ico (devDependencies)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, '../src');
const brandDir = resolve(srcDir, 'assets/brand');

// T1 (dark tile) is the universal raster mark: bright nodes read on any chrome.
const markDark = readFileSync(resolve(brandDir, 'logo-mark-dark.svg'));

const png = (size) => sharp(markDark, { density: 384 }).resize(size, size).png();

const pngTargets = [
  { file: `${brandDir}/favicon-16.png`, size: 16 },
  { file: `${brandDir}/favicon-32.png`, size: 32 },
  { file: `${brandDir}/favicon-48.png`, size: 48 },
  { file: `${brandDir}/apple-touch-icon.png`, size: 180 },
  { file: `${brandDir}/icon-192.png`, size: 192 },
  { file: `${brandDir}/icon-512.png`, size: 512 },
  { file: `${brandDir}/icon-maskable-512.png`, size: 512 },
];

// og:image / social card — mark centered on the brand ink background, font-free.
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#1b2330"/>
  <g transform="translate(456,171) scale(4.5)">
    <path d="M32 17L17 45L47 45Z" fill="none" stroke="#fff7e7" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="32" cy="17" r="5.5" fill="#ff9900"/>
    <circle cx="17" cy="45" r="5.5" fill="#4aa3f0"/>
    <circle cx="47" cy="45" r="5.5" fill="#2bbf7a"/>
  </g>
</svg>`;

const run = async () => {
  for (const t of pngTargets) {
    await png(t.size).toFile(t.file);
    console.log('wrote', t.file.replace(srcDir, 'src'));
  }

  await sharp(Buffer.from(ogSvg)).png().toFile(`${brandDir}/og-image.png`);
  console.log('wrote src/assets/brand/og-image.png');

  // Multi-resolution favicon.ico (16/32/48) at the served web root.
  const ico = await pngToIco([
    await png(16).toBuffer(),
    await png(32).toBuffer(),
    await png(48).toBuffer(),
  ]);
  writeFileSync(resolve(srcDir, 'favicon.ico'), ico);
  console.log('wrote src/favicon.ico');
};

run().catch((e) => { console.error(e); process.exit(1); });
