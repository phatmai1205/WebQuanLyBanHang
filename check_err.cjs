const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', error => {
    console.log('PAGE ERROR STR:', error.toString());
    console.log('PAGE ERROR STACK:', error.stack);
  });
  page.on('console', msg => {
    console.log('CONSOLE:', msg.text());
  });
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
