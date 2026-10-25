// scripts/og/generate.cjs — genera public/og-{es,en,pt}.png (1200×630) con la identidad de marca.
// Requiere Playwright instalado globalmente o como dependencia local (no es dependencia del proyecto):
//   npx playwright install chromium && node scripts/og/generate.cjs
const path = require('node:path');
const { chromium } = require('playwright');

const OUT = path.resolve(__dirname, '../../public');

const taglines = {
  es: 'Páginas web y marca que <em>atraen clientes.</em>',
  en: 'Websites and brand that <em>attract clients.</em>',
  pt: 'Sites e marca que <em>atraem clientes.</em>',
};

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 68" fill="none">
  <line x1="30" y1="4" x2="30" y2="52" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  <polyline points="25,14 30,4 35,14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="12" y1="20" x2="12" y2="48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  <polyline points="8,28 12,20 16,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="48" y1="20" x2="48" y2="48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  <polyline points="44,28 48,20 52,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 56 Q19 50 30 56 Q41 62 52 56" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
</svg>`;

const html = (tagline) => `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=JetBrains+Mono:wght@400&display=block">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; background: #0D1B2A; color: #fff; overflow: hidden; }
  .card { position: relative; width: 1200px; height: 630px; padding: 72px 88px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
  .rule { position: absolute; left: 88px; right: 88px; top: 72px; height: 1px; background: #1B2B45; }
  .brand { display: flex; align-items: center; gap: 28px; margin-top: 40px; }
  .brand svg { width: 96px; height: 108px; color: #A7ADBA; }
  .brand span { font-family: 'Cormorant Garamond', serif; font-size: 92px; letter-spacing: 0.06em; line-height: 1; }
  .tagline { font-family: 'Cormorant Garamond', serif; font-size: 54px; line-height: 1.15; color: #A7ADBA; max-width: 900px; }
  .tagline em { color: #fff; }
  .meta { font-family: 'JetBrains Mono', monospace; font-size: 17px; letter-spacing: 0.22em; text-transform: uppercase; color: #A7ADBA; display: flex; justify-content: space-between; border-top: 1px solid #1B2B45; padding-top: 24px; }
</style></head>
<body><div class="card">
  <div class="rule"></div>
  <div class="brand">${mark}<span>Neptum Studio</span></div>
  <div class="tagline">${tagline}</div>
  <div class="meta"><span>Santiago, Chile</span><span>ES · EN · PT</span></div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const [locale, tagline] of Object.entries(taglines)) {
    await page.setContent(html(tagline), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(OUT, `og-${locale}.png`);
    await page.screenshot({ path: out, type: 'png' });
    console.log('ok', out);
  }
  await browser.close();
})().catch((err) => { console.error(err); process.exit(1); });
