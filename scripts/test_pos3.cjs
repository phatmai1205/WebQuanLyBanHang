const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
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
  
  await new Promise(r => setTimeout(r, 500));
  
  let styles = await page.evaluate(() => {
    return {
      classes: document.getElementById('module-pos').className,
      display: getComputedStyle(document.getElementById('module-pos')).display,
      html: document.getElementById('module-pos').innerHTML.substring(0, 150)
    };
  });
  console.log(styles);
  await browser.close();
})();
