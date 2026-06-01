const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('let items = appData.KHO;', 'let items = appData.SANPHAM || [];');
html = html.replace(/appData\.KHO/g, 'appData.SANPHAM');
html = html.replace(/p\.NhomHang/g, 'p.TenLoaiSP');

fs.writeFileSync('index.html', html);
console.log('Fixed appData.KHO error');
