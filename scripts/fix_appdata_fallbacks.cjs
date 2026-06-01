const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace("let appData = JSON.parse(localStorage.getItem('adminAppData'));",
`let appData = JSON.parse(localStorage.getItem('adminAppData'));
    if (appData) {
        if (!appData.DONHANG) appData.DONHANG = [];
        if (!appData.CTDH) appData.CTDH = [];
        if (!appData.TAIKHOAN) appData.TAIKHOAN = [];
        if (!appData.SANPHAM) appData.SANPHAM = [];
        if (!appData.KHACHHANG) appData.KHACHHANG = [];
    }`);

fs.writeFileSync('index.html', html);
console.log('Added appData fallbacks');
