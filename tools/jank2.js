const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--headless=new'],
  });
  const page = await browser.newPage();
  const ts = {};
  page.on('framenavigated', f => { ts.nav = performance.now(); });
  const t0 = Date.now();
  await page.goto('http://127.0.0.1:4000/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  ts.dcl = Date.now() - t0;
  await page.waitForSelector('#hb-hero', { timeout: 5000 });
  ts.hero = Date.now() - t0;
  await page.waitForSelector('.hb-cat-group[data-cat="hardware-interface-protocol"]', { timeout: 5000 });
  ts.cats = Date.now() - t0;
  await page.waitForLoadState('networkidle');
  ts.ni = Date.now() - t0;

  const info = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const fp = performance.getEntriesByName('first-paint');
    const mp = performance.getEntriesByName('main');
    const res = performance.getEntriesByType('resource')
      .filter(r => r.name.includes('js/') || r.name.includes('css'))
      .map(r => ({ n: r.name.split('/').slice(-2).join('/'), s: Math.round(r.startTime), e: Math.round(r.responseEnd), dur: Math.round(r.duration) }))
      .sort((a, b) => b.e - a.e);
    return { dcl: nav.domContentLoadedEventEnd, load: nav.loadEventEnd, fp: fp[0] ? fp[0].startTime : -1, largest: res.slice(0, 5), totalRes: res.length };
  });

  console.log('wall clock ms:', JSON.stringify(ts));
  console.log('performance:', JSON.stringify(info, null, 1));

  await page.screenshot({ path: 'public/chk-jank.png' });
  await browser.close();
})();
