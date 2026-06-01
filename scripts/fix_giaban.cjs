const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/GiaBan/g, 'DonGia');

fs.writeFileSync('index.html', html);
console.log('Replaced GiaBan with DonGia');
