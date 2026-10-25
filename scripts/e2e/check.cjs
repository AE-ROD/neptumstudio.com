const { chromium } = require('playwright');
// scripts/e2e/check.cjs — comprobaciones de extremo a extremo contra `npm run preview` (requiere Playwright instalado; no es dependencia del proyecto).
// Uso: npm run build && npm run preview &  node scripts/e2e/check.cjs   (BASE_URL opcional)
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const SHOTS = __dirname + '/shots';
require('node:fs').mkdirSync(SHOTS, { recursive: true });
const results = [];
const check = (name, ok, extra = '') => { results.push({ name, ok, extra }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' — ' + extra : ''}`); };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

  // ── Home ES ──
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4500); // loader intro
  check('loader hidden after intro', await page.locator('#loader').evaluate((el) => getComputedStyle(el).display === 'none'));
  check('navbar has no transform after intro', await page.locator('#navbar').evaluate((el) => getComputedStyle(el).transform === 'none'));
  const html = await page.content();
  check('no #projects links', !/href="[^"]*#projects"/.test(html));
  check('no Blog in nav/footer', !/>Blog</.test(html));
  check('no fake metrics', !/98<\/span>|\+120%|24\/7/.test(html));
  check('hero h1 text', (await page.locator('h1').innerText()).includes('atraen clientes'));
  check('4 service lines link to /servicios#', (await page.locator('#services a.line-link').evaluateAll((as) => as.map((a) => a.getAttribute('href')))).join(',') === '/servicios/#landing,/servicios/#rediseno,/servicios/#reposicionamiento,/servicios/#crecimiento');
  check('no Projects section when empty', (await page.locator('#projects').count()) === 0);
  await page.screenshot({ path: `${SHOTS}/home-desktop.png`, fullPage: true });

  // ── Client-side navigation home → servicios (view transitions) ──
  await page.click('.hero-btns a.btn-light');
  await page.waitForURL('**/servicios/');
  await page.waitForTimeout(800);
  check('navigated to /servicios/ client-side', page.url().endsWith('/servicios/'));
  check('loader hidden after soft nav', await page.locator('#loader').evaluate((el) => getComputedStyle(el).display === 'none'));
  check('body scroll not locked', await page.evaluate(() => document.body.style.overflow === ''));
  check('first tab active by default', await page.locator('[role=tab][aria-selected=true]').getAttribute('data-tab') === 'landing');
  check('only one panel visible', (await page.locator('[role=tabpanel]:not([hidden])').count()) === 1);
  check('indicator positioned', await page.locator('.tabs-indicator').evaluate((el) => el.classList.contains('is-ready') && parseFloat(el.style.width) > 20));
  check('featured badge present', (await page.locator('.cmp-badge').first().innerText()).toLowerCase().includes('elegido'));
  check('ideal para row', (await page.locator('.cmp-row--audience th').first().innerText()) === 'Ideal para');
  const quote = await page.locator('#landing .cmp-action a').nth(1).getAttribute('href');
  check('cotizar link', quote === '/contacto/?servicio=landing-impulso', quote);
  await page.screenshot({ path: `${SHOTS}/servicios-landing-desktop.png`, fullPage: true });

  // Tab click updates hash
  await page.click('[role=tab][data-tab=packs]');
  await page.waitForTimeout(400);
  check('hash updated on tab click', new URL(page.url()).hash === '#packs');
  check('packs panel visible', await page.locator('#packs').isVisible());
  const savings = await page.locator('#packs .offer-saving').allInnerTexts();
  check('pack savings computed', savings.join('|').toLowerCase() === 'ahorras $150.000|ahorras $130.000|ahorras $170.000', savings.join('|'));
  await page.screenshot({ path: `${SHOTS}/servicios-packs-desktop.png`, fullPage: true });

  // Keyboard navigation
  await page.focus('[role=tab][aria-selected=true]');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  check('ArrowRight moves to planes', await page.locator('[role=tab][aria-selected=true]').getAttribute('data-tab') === 'planes');
  check('focus follows', await page.evaluate(() => document.activeElement?.getAttribute('data-tab')) === 'planes');
  await page.screenshot({ path: `${SHOTS}/servicios-planes-desktop.png`, fullPage: true });
  await page.click('[role=tab][data-tab=complementos]');
  await page.waitForTimeout(300);
  check('complementos has 2 groups', (await page.locator('#complementos .rows-group').count()) === 2);
  check('express is +30%', (await page.locator('#complementos .row').nth(6).locator('.price-amount').innerText()) === '+30%');
  await page.screenshot({ path: `${SHOTS}/servicios-complementos-desktop.png`, fullPage: true });

  // Direct hash load
  await page.goto(BASE + '/servicios/#rediseno', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  check('hash load activates rediseno', await page.locator('[role=tab][aria-selected=true]').getAttribute('data-tab') === 'rediseno');
  check('rediseno panel visible', await page.locator('#rediseno').isVisible());
  const y = await page.evaluate(() => window.scrollY);
  check('scrolled to catalog on hash load', y > 300, `scrollY=${y}`);

  // Home → footer link to #planes (cross-page hash) via client nav
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.click('footer a[href="/servicios/#planes"]');
  await page.waitForURL('**/servicios/#planes');
  await page.waitForTimeout(700);
  check('cross-page hash → planes tab', await page.locator('[role=tab][aria-selected=true]').getAttribute('data-tab') === 'planes');

  // ── Contact: prefill + mocked submission ──
  let posted = null;
  await page.route('**/api.web3forms.com/submit', async (route) => {
    posted = route.request().postDataBuffer()?.toString() ?? route.request().postData();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: 'ok' }) });
  });
  await page.goto(BASE + '/contacto/?servicio=landing-impulso', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const selVal = await page.locator('#service').inputValue();
  check('service prefilled from ?servicio=', selVal === 'LAN-02 · Impulso', selVal);
  check('subject reflects service', (await page.locator('#form-subject').inputValue()) === 'Cotización: LAN-02 · Impulso — Neptum Studio');
  check('booking block hidden without env', (await page.locator('.booking').count()) === 0);
  await page.fill('#name', 'Prueba Neptum');
  await page.fill('#email', 'prueba@example.com');
  await page.fill('#company', 'Empresa de prueba');
  await page.fill('#message', 'Mensaje de prueba automatizado.');
  await page.screenshot({ path: `${SHOTS}/contacto-desktop.png`, fullPage: true });
  await page.click('#form-submit');
  await page.waitForSelector('#form-success:not([hidden])', { timeout: 5000 });
  check('success status shown', await page.locator('#form-success').isVisible());
  check('form reset after success', (await page.locator('#name').inputValue()) === '');
  const hasField = (k, v) => posted && posted.includes(`name="${k}"`) && posted.includes(v);
  check('payload has access_key', hasField('access_key', 'e1284dcc'));
  check('payload has service', hasField('service', 'LAN-02'));
  check('payload has subject', hasField('subject', 'LAN-02'));
  check('payload has idioma', hasField('idioma', 'es'));
  check('payload has email', hasField('email', 'prueba@example.com'));
  await page.screenshot({ path: `${SHOTS}/contacto-success.png` });

  // Error path
  await page.unroute('**/api.web3forms.com/submit');
  await page.route('**/api.web3forms.com/submit', (route) => route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'bad' }) }));
  await page.fill('#name', 'Prueba');
  await page.fill('#email', 'prueba@example.com');
  await page.selectOption('#service', { index: 1 });
  await page.fill('#message', 'x');
  await page.click('#form-submit');
  await page.waitForSelector('#form-error:not([hidden])', { timeout: 5000 });
  check('error status shown', await page.locator('#form-error').isVisible());
  check('submit re-enabled', !(await page.locator('#form-submit').isDisabled()));

  // No-JS redirect return
  await page.goto(BASE + '/contacto/?enviado=1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  check('?enviado=1 shows success', await page.locator('#form-success').isVisible());
  check('?enviado=1 cleaned from URL', !page.url().includes('enviado'));

  // ── Locales ──
  for (const [path, lang, h1] of [['/en/', 'en-US', 'attract clients'], ['/pt/', 'pt-BR', 'atraem clientes'], ['/en/services/', 'en-US', 'Every service'], ['/pt/servicos/', 'pt-BR', 'Todos os serviços'], ['/en/contact/', 'en-US', 'Tell us'], ['/pt/contato/', 'pt-BR', 'Conte o que']]) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    const lg = await page.locator('html').getAttribute('lang');
    const t = await page.locator('h1').innerText();
    check(`${path} lang=${lang} h1 ok`, lg === lang && t.includes(h1), `${lg} / ${t}`);
  }
  await page.goto(BASE + '/en/services/#packs', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const enSave = await page.locator('#packs .offer-saving').allInnerTexts();
  check('EN pack savings', (enSave[0]||'').toLowerCase() === 'you save $150.000', enSave.join('|'));
  check('EN quote btn', (await page.locator('#packs .offer-cta').first().innerText()) === 'GET A QUOTE' || (await page.locator('#packs .offer-cta').first().innerText()) === 'Get a quote');
  // Language switcher keeps the page
  const enSwitch = await page.locator('#navbar .lang-switch a[hreflang=pt]').getAttribute('href');
  check('lang switch keeps page', enSwitch === '/pt/servicos/', enSwitch);
  await page.screenshot({ path: `${SHOTS}/en-services-packs.png`, fullPage: true });

  // ── Mobile ──
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const m = await mctx.newPage();
  m.on('pageerror', (e) => errors.push(`mobile pageerror: ${e.message}`));
  await m.goto(BASE + '/', { waitUntil: 'networkidle' });
  await m.waitForTimeout(4500);
  await m.screenshot({ path: `${SHOTS}/home-mobile.png`, fullPage: true });
  await m.click('#hamburger');
  await m.waitForTimeout(400);
  check('mobile menu opens', await m.locator('#mobile-menu').evaluate((el) => el.classList.contains('open') && getComputedStyle(el).visibility === 'visible'));
  check('hamburger aria-expanded', (await m.locator('#hamburger').getAttribute('aria-expanded')) === 'true');
  await m.screenshot({ path: `${SHOTS}/menu-mobile.png` });
  await m.click('#mobile-menu .mobile-links a[href="/servicios/"]');
  await m.waitForURL('**/servicios/');
  await m.waitForTimeout(800);
  check('mobile menu closed after nav', await m.locator('#mobile-menu').evaluate((el) => !el.classList.contains('open')));
  check('mobile body scroll unlocked', await m.evaluate(() => document.body.style.overflow === ''));
  check('swipe hint visible on mobile', await m.locator('.cmp-hint').first().isVisible());
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth <= 390 && window.innerWidth === 390);
  check('no horizontal page overflow on mobile', overflow);
  check('table scrolls horizontally', await m.locator('#landing .cmp-scroll').evaluate((el) => el.scrollWidth > el.clientWidth));
  await m.screenshot({ path: `${SHOTS}/servicios-mobile.png`, fullPage: true });
  await m.click('[role=tab][data-tab=crecimiento]');
  await m.waitForTimeout(400);
  await m.screenshot({ path: `${SHOTS}/servicios-crecimiento-mobile.png`, fullPage: true });
  await m.goto(BASE + '/contacto/', { waitUntil: 'networkidle' });
  await m.screenshot({ path: `${SHOTS}/contacto-mobile.png`, fullPage: true });

  // Reduced motion
  const rctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const r = await rctx.newPage();
  await r.goto(BASE + '/', { waitUntil: 'networkidle' });
  await r.waitForTimeout(500);
  check('reduced motion: loader not shown', await r.locator('#loader').evaluate((el) => getComputedStyle(el).display === 'none'));
  check('reduced motion: all steps visible', (await r.locator('.scrolly-panel').evaluateAll((els) => els.filter((e) => getComputedStyle(e).visibility === 'visible').length)) === 4);

  const realErrors = errors.filter((e) => !e.includes('400 (Bad Request)'));
  check('no page/console errors (except mocked 400)', realErrors.length === 0, realErrors.slice(0, 5).join(' | '));
  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
