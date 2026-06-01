const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', error => {
    console.log('PAGE ERROR STACK:', error.stack);
  });
  page.on('console', msg => {
    console.log('CONSOLE:', msg.text());
  });
  await page.goto('http://localhost:3000');
  
  await page.type('#login-username', 'admin');
  await page.type('#login-password', '123');
  await page.click('button[onclick="login()"]');
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const posNav = Array.from(document.querySelectorAll('.nav-item')).find(el => el.innerText.includes('Bán hàng'));
    if(posNav) posNav.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const posItems = document.querySelectorAll('.pos-product-item');
    if(posItems.length > 0) posItems[0].click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    const payBtn = document.querySelector('button[onclick="openPosPaymentModal()"]');
    if(payBtn) payBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[onclick="submitPosPayment()"]');
    if(submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
})();
