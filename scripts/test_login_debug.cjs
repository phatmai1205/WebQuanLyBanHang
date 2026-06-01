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
  
  await page.evaluate(() => {
     console.log('User value:', document.getElementById('login-username').value);
     const acc = window.appData ? window.appData.TAIKHOAN : null;
     console.log('Has appData?', !!window.appData);
     // Since appData might be local, let's get it from localStorage
     const localApp = JSON.parse(localStorage.getItem('adminAppData'));
     console.log('Has local appData?', !!localApp);
     if (localApp) {
        console.log('Number of accounts:', localApp.TAIKHOAN ? localApp.TAIKHOAN.length : 0);
        localApp.TAIKHOAN.forEach(tk => {
           console.log('Account:', tk.username, tk.password, tk.TrangThai);
        });
     }
  });

  await browser.close();
})();
