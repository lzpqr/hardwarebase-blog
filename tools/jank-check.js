const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--headless=new'],
  });
  const page = await browser.newPage();
  const t0 = Date.now();
  await page.goto('http://127.0.0.1:4000/', { waitUntil: 'networkidle', timeout: 30000 });
  const t1 = Date.now();
  // measure layout after DOM: capture when hero + cat grid appear
  await page.waitForSelector('#hb-hero', { timeout: 5000 });
  const t2 = Date.now();
  await page.waitForSelector('.hb-cat-group[data-cat="hardware-interface-protocol"]', { timeout: 5000 });
  const t3 = Date.now();

  // Long tasks
  const longTasks = await page.evaluate(() =>
    performance.getEntriesByType('longtask').map(t => ({ dur: t.duration, start: t.startTime }))
  );
  const resources = await page.evaluate(() =>
    performance.getEntriesByType('resource')
      .map(r => ({ name: r.name.split('/').pop().slice(0, 40), dur: Math.round(r.duration), size: r.transferSize }))
      .sort((a, b) => b.dur - a.dur)
      .slice(0, 10)
  );

  console.log('--- timing (ms) ---');
  console.log('networkidle:', t1 - t0);
  console.log('hero visible:', t2 - t0);
  console.log('all 3 cat groups:', t3 - t0);
  console.log('--- long tasks ---');
  longTasks.forEach(t => console.log(t.start.toFixed(0), 'start', t.dur.toFixed(0), 'dur'));
  console.log('--- top resources by time ---');
  resources.forEach(r => console.log(r.dur, 'ms', r.name, r.size ? r.size + 'B' : ''));

  await page.screenshot({ path: 'public/chk-jank.png', fullPage: false });
  await browser.close();
})();
