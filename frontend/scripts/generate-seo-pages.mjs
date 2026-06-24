// Generates static, crawler-friendly HTML pages for each AWS service from the
// same JSON data the app uses, plus a service hub, sitemap.xml, and llms.txt.
//
// Why static pages: the app is a single-URL client-side SPA, so AI answer
// engines and many crawlers (which do not run JS) see almost nothing. These
// prerendered pages give every service its own indexable URL with full prose
// and JSON-LD (TechArticle + FAQPage + BreadcrumbList), so a search like
// "what is AWS Lambda and how does it work" can surface this site.
//
// Run automatically after `ng build` (see package.json "build" script).
// Output is written directly into the Angular build output so Cloudflare Pages
// serves it at the site root.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..'); // frontend/
const CORE = join(ROOT, 'src', 'app', 'core');
const OUT = join(ROOT, 'dist', 'aws-system-design-simulator-client', 'browser');

const SITE = 'https://srarchitect.qzz.io';
const TODAY = new Date().toISOString().slice(0, 10);

const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const services = read(join(CORE, 'config', 'aws-services.json')).services;
const docs = read(join(CORE, 'data', 'service-documentation.json'));
const costModel = read(join(CORE, 'data', 'service-cost-model.json')).serviceCostModel;

const nameByType = Object.fromEntries(services.map((s) => [s.type, s.name]));

// HTML-escape for text nodes / attributes.
const esc = (s = '') =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

// Lowercase the `type` token for clean, search-friendly URLs
// (e.g. dynamoDb -> dynamodb, apiGateway -> apigateway).
const slug = (t) => t.toLowerCase();

// Real services only, skip the "Users" traffic-source node.
const indexable = services.filter((s) => s.type !== 'client' && docs[s.type]);

// ---------- shared page styling (inlined; zero external requests) ----------
const STYLE = `
:root{--bg:#fff7e7;--panel:#fffdf7;--ink:#23272f;--muted:#5b6472;--line:#ece3cd;--accent:#c47d1a;--accentink:#7a4d05;--chip:#f3ead4}
@media (prefers-color-scheme:dark){:root{--bg:#161c26;--panel:#1b2330;--ink:#e8edf5;--muted:#9aa6b8;--line:#2a3447;--accent:#e0a64b;--accentink:#f0c87f;--chip:#212c3d}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.wrap{max-width:820px;margin:0 auto;padding:28px 20px 72px}
a{color:var(--accentink);text-decoration:none}a:hover{text-decoration:underline}
nav.crumbs{font-size:13px;color:var(--muted);margin-bottom:18px}
.cat{display:inline-block;font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--accentink);background:var(--chip);border:1px solid var(--line);padding:3px 10px;border-radius:999px}
h1{font-size:2rem;line-height:1.2;margin:.5rem 0 .3rem}
.lede{font-size:1.12rem;color:var(--muted);margin:0 0 1.4rem}
h2{font-size:1.25rem;margin:2rem 0 .6rem;padding-top:.4rem;border-top:1px solid var(--line)}
h2:first-of-type{border-top:0}
ul{padding-left:1.2rem}li{margin:.3rem 0}
.card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin:.6rem 0}
.formula{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.92rem;background:var(--chip);border:1px solid var(--line);border-radius:8px;padding:8px 10px;display:block;overflow-x:auto}
.cta{display:inline-block;margin-top:.4rem;background:var(--accent);color:#1b1206;font-weight:600;padding:11px 18px;border-radius:10px}
.cta:hover{text-decoration:none;filter:brightness(1.05)}
.related{display:flex;flex-wrap:wrap;gap:8px;padding:0;list-style:none}
.related li{margin:0}
.related a{display:inline-block;background:var(--chip);border:1px solid var(--line);border-radius:999px;padding:5px 12px;font-size:.9rem}
footer{margin-top:3rem;padding-top:1rem;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}
`.trim();

// ---------- per-service page ----------
function relatedFor(svc) {
  const seen = new Set();
  const out = [];
  for (const r of svc.rules || []) {
    if (r.target && r.target !== svc.type && nameByType[r.target] && !seen.has(r.target)) {
      seen.add(r.target);
      out.push(r.target);
    }
  }
  return out.slice(0, 12);
}

function costSection(cm) {
  if (!cm || !cm.costEvaluation) return '';
  const ce = cm.costEvaluation;
  let html = '<h2>How cost is calculated</h2>';
  if (ce.formula) html += `<p>Monthly cost is modeled as:</p><code class="formula">${esc(ce.formula)}</code>`;
  if (Array.isArray(ce.components) && ce.components.length) {
    html += '<ul>';
    for (const c of ce.components) {
      const f = c.formula ? ` <code class="formula" style="display:inline;padding:1px 6px">${esc(c.formula)}</code>` : '';
      const note = c.note ? `: ${esc(c.note)}` : '';
      html += `<li><strong>${esc(c.name || c.id)}:</strong>${f}${note}</li>`;
    }
    html += '</ul>';
  }
  return html;
}

function faqJsonLd(name, d, cm) {
  const qa = [
    [`What is ${name}?`, d.overview],
    [`How does ${name} work?`, [d.conceptualModel, ...(d.keyCharacteristics || [])].filter(Boolean).join(' ')],
    [`When should you use ${name}?`, d.recommendedUsing],
    [`When should you avoid ${name}?`, d.recommendedAvoiding],
  ];
  if (cm?.costEvaluation?.formula) {
    qa.push([`How is ${name} priced?`, `Cost is modeled as ${cm.costEvaluation.formula}. Major drivers include throughput, execution time/duration, and storage where applicable.`]);
  }
  return {
    '@type': 'FAQPage',
    mainEntity: qa
      .filter(([, a]) => a)
      .map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

function servicePage(svc) {
  const name = svc.name;
  const d = docs[svc.type];
  const cm = costModel[svc.type];
  const url = `${SITE}/services/${slug(svc.type)}/`;
  const hasBrand = /^(AWS|Amazon)/.test(name);
  const titleProduct = hasBrand ? name : `${name} (AWS)`;
  const title = `${titleProduct}: What It Is, How It Works & Cost | Sr. Architect`;
  const desc = (d.overview || '').slice(0, 158);

  const related = relatedFor(svc);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        headline: `${name}: what it is, how it works, and how it is priced`,
        description: d.overview,
        about: `Amazon Web Services ${name}`,
        keywords: [name, `AWS ${name}`, `${name} cost`, `${name} pricing`, `what is ${name}`, svc.category].join(', '),
        articleSection: svc.category,
        inLanguage: 'en',
        datePublished: '2026-01-01',
        dateModified: TODAY,
        author: { '@type': 'Person', name: 'Sushant Kumar' },
        publisher: { '@type': 'Organization', name: 'Sr. Architect', url: SITE },
        mainEntityOfPage: url,
        isPartOf: { '@type': 'WebSite', name: 'Sr. Architect', url: SITE },
      },
      faqJsonLd(name, d, cm),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'AWS Service Library', item: `${SITE}/services/` },
          { '@type': 'ListItem', position: 3, name, item: url },
        ],
      },
    ],
  };

  const list = (arr) => (arr || []).map((x) => `<li>${esc(x)}</li>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(titleProduct)}: what it is, how it works & cost">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/assets/brand/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#fff7e7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1b2330" media="(prefers-color-scheme: dark)">
<style>${STYLE}</style>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<div class="wrap">
<nav class="crumbs"><a href="/">Home</a> › <a href="/services/">AWS Service Library</a> › ${esc(name)}</nav>
<span class="cat">${esc(svc.category)}</span>
<h1>${esc(name)} <span style="color:var(--muted);font-weight:400">(AWS)</span></h1>
<p class="lede">${esc(d.overview)}</p>

<a class="cta" href="/">Try it in the interactive AWS simulator →</a>

${d.conceptualModel ? `<h2>The simple mental model</h2><p>${esc(d.conceptualModel)}</p>` : ''}

${d.keyCharacteristics?.length ? `<h2>How ${esc(name)} works</h2><ul>${list(d.keyCharacteristics)}</ul>` : ''}

${d.recommendedUsing ? `<h2>When to use ${esc(name)}</h2><p>${esc(d.recommendedUsing)}</p>` : ''}

${d.recommendedAvoiding ? `<h2>When to avoid ${esc(name)}</h2><p>${esc(d.recommendedAvoiding)}</p>` : ''}

${d.practicalScenario ? `<h2>Example scenario</h2><div class="card">${esc(d.practicalScenario)}</div>` : ''}

${d.commonIntegrationPatterns?.length ? `<h2>Common integration patterns</h2><ul>${list(d.commonIntegrationPatterns)}</ul>` : ''}

${costSection(cm)}

${related.length ? `<h2>Related AWS services</h2><ul class="related">${related.map((t) => `<li><a href="/services/${slug(t)}/">${esc(nameByType[t])}</a></li>`).join('')}</ul>` : ''}

<h2>See ${esc(name)} under real traffic</h2>
<p>Drop ${esc(name)} onto a canvas, connect it to the rest of your architecture, and run a deterministic simulation to watch its requests per second, latency, and utilization, plus an accurate monthly cost estimate and where the bottleneck forms.</p>
<a class="cta" href="/">Open the simulator →</a>

<footer>
Part of the <a href="/services/">AWS Service Library</a> on
<a href="/">Sr. Architect, the free, open-source AWS system design simulator</a>.
Pricing and behavior are modeled for learning and estimation; always confirm against
<a href="https://aws.amazon.com/pricing/" rel="nofollow noopener">official AWS pricing</a>.
</footer>
</div>
</body>
</html>`;
}

// ---------- hub page ----------
function hubPage() {
  const byCat = {};
  for (const s of indexable) (byCat[s.category] ||= []).push(s);
  const cats = Object.keys(byCat).sort();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AWS Service Library',
    description: 'Plain-language guides to AWS services: what each one is, how it works, when to use it, and how it is priced.',
    url: `${SITE}/services/`,
    hasPart: indexable.map((s) => ({ '@type': 'TechArticle', name: s.name, url: `${SITE}/services/${slug(s.type)}/` })),
  };
  const sections = cats
    .map(
      (c) =>
        `<h2>${esc(c)}</h2><ul class="related">${byCat[c]
          .map((s) => `<li><a href="/services/${slug(s.type)}/">${esc(s.name)}</a></li>`)
          .join('')}</ul>`,
    )
    .join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>AWS Service Library: What Each Service Is, How It Works & Cost | Sr. Architect</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Plain-language guides to ${indexable.length}+ AWS services: what each is, how it works, when to use it, and how it is priced. Then model them under live traffic and cost.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${SITE}/services/">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta property="og:type" content="website">
<meta property="og:title" content="AWS Service Library | Sr. Architect">
<meta property="og:url" content="${SITE}/services/">
<style>${STYLE}</style>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<div class="wrap">
<nav class="crumbs"><a href="/">Home</a> › AWS Service Library</nav>
<h1>AWS Service Library</h1>
<p class="lede">Plain-language guides to ${indexable.length} AWS services: what each one is, how it works, when to use it, and how it is priced. Then drop them onto a canvas and simulate traffic, cost, and bottlenecks.</p>
<a class="cta" href="/">Open the AWS system design simulator →</a>
${sections}
<footer>Part of <a href="/">Sr. Architect, the free, open-source AWS system design simulator</a>.</footer>
</div>
</body>
</html>`;
}

// ---------- sitemap + llms.txt ----------
function sitemap() {
  const urls = [
    { loc: `${SITE}/`, pri: '1.0' },
    { loc: `${SITE}/services/`, pri: '0.9' },
    ...indexable.map((s) => ({ loc: `${SITE}/services/${slug(s.type)}/`, pri: '0.8' })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${TODAY}</lastmod><changefreq>monthly</changefreq><priority>${u.pri}</priority></url>`)
  .join('\n')}
</urlset>
`;
}

function llmsTxt() {
  const lines = [
    '# Sr. Architect: AWS System Design Simulator',
    '',
    '> A free, open-source, browser-based tool to design AWS architectures and run a deterministic traffic-and-cost simulation. Drag AWS services onto a canvas, connect them, and see per-node RPS, latency, and utilization, an accurate monthly AWS cost estimate, and the traffic bottleneck. Built for engineers learning system design, people learning AWS, and cloud architects estimating real cost.',
    '',
    '## Core',
    `- [AWS System Design Simulator](${SITE}/): interactive canvas, live simulation, cost estimation, and bottleneck detection.`,
    `- [AWS Service Library](${SITE}/services/): guides to every supported AWS service.`,
    '',
    '## AWS service guides',
    ...indexable.map((s) => `- [${s.name}](${SITE}/services/${slug(s.type)}/): ${(docs[s.type].overview || '').slice(0, 120)}`),
    '',
  ];
  return lines.join('\n');
}

// ---------- write everything ----------
function write(rel, content) {
  const full = join(OUT, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
}

let n = 0;
for (const svc of indexable) {
  write(join('services', slug(svc.type), 'index.html'), servicePage(svc));
  n++;
}
write(join('services', 'index.html'), hubPage());
write('sitemap.xml', sitemap());
write('llms.txt', llmsTxt());

console.log(`[seo] generated ${n} service pages + hub + sitemap.xml + llms.txt into ${OUT}`);
