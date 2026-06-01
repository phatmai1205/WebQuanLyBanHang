const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => {
    console.log('CONSOLE:', msg.text());
  });
  await page.goto('http://localhost:3000');
  
  await page.type('#login-username', 'admin');
  await page.type('#login-password', '123');
  await page.click('button[onclick="login()"]');
  await new Promise(r => setTimeout(r, 1000));
  
  let cu = await page.evaluate(() => {
    return window.currentUser;
  });
  console.log('CURRENT USER:', cu);

  await browser.close();
})();
