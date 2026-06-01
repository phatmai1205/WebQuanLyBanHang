const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/appData\.NHANSU/g, 'appData.TAIKHOAN');

fs.writeFileSync('index.html', html);
console.log('Fixed NHANSU to TAIKHOAN');
