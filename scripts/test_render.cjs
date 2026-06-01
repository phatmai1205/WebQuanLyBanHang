const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000');
  
  await page.evaluate(() => {
    document.getElementById('login-username').value = 'admin';
    document.getElementById('login-password').value = '123';
  });
  await page.click('button[onclick="login()"]');
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const posNav = Array.from(document.querySelectorAll('.nav-item')).find(el => el.innerText.includes('Bán hàng'));
    if(posNav) posNav.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({path: 'pos_screenshot.png'});
  console.log('Saved pos_screenshot.png');
  await browser.close();
})();
