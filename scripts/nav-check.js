// Temporary visual-regression check: desktop + mobile homepage, one post, one collection.
// Loaded as a plain node script, NOT by hexo (kept outside scripts/ would be ideal,
// but hexo only auto-loads scripts/*.js, so we run it manually and delete after).
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--headless=new']
  });

  async function shot(path, url, { width = 1280, height = 900, fullPage = false } = {}) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', e => errors.push('PAGE ERROR: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const info = await page.evaluate(() => {
      const nav = document.querySelector('#nav');
      const cs = nav ? getComputedStyle(nav) : null;
      const overflow = document.body.scrollWidth > document.documentElement.clientWidth + 2;
      return { navOpacity: cs ? cs.opacity : 'no-nav', bodyOverflowX: overflow };
    });
    await page.screenshot({ path, fullPage });
    console.log(path, info);
    if (errors.length) console.log('  ERRORS:', errors.slice(0, 10).join(' | '));
    await page.close();
  }

  await shot('public/chk-home-desktop.png', 'http://127.0.0.1:4000/', { fullPage: true });
  await shot('public/chk-home-mobile.png', 'http://127.0.0.1:4000/', { width: 390, height: 844 });
  await shot('public/chk-post.png', 'http://127.0.0.1:4000/posts/hardware-development-process/');
  await shot('public/chk-collection.png', 'http://127.0.0.1:4000/collections/hardware-development/');

  await browser.close();
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
