const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--headless=new']
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGE ERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const navVisible = await page.evaluate(() => {
    const nav = document.querySelector('#nav');
    if (!nav) return 'no #nav element';
    const cs = getComputedStyle(nav);
    return 'opacity=' + cs.opacity + ' class=["' + nav.className + '"]';
  });
  const title = await page.title();
  await page.screenshot({ path: 'public/nav-check.png' });
  console.log('TITLE:', title);
  console.log('NAV STATE:', navVisible);
  console.log('ERRORS:', errors.slice(0, 20).join('\n') || '(none)');
  await browser.close();
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
