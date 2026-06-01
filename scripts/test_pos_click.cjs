const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR STACK:', err.stack || err));
  
  await page.goto('http://localhost:3000');
  
  await page.evaluate(() => {
    document.getElementById('login-username').value = 'admin';
    document.getElementById('login-password').value = '123';
  });
  await page.click('button[onclick="login()"]');
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Clicking POS nav...');
  await page.evaluate(() => {
    const posNav = Array.from(document.querySelectorAll('.nav-item')).find(el => el.innerText.includes('Bán hàng'));
    if(posNav) posNav.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  console.log('Done.');
  await browser.close();
})();
