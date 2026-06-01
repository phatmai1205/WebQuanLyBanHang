const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
    '<!-- Address Section -->\n          <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 25px; position: relative;">',
    '<!-- Address Section -->\n          <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 25px; position: relative; z-index: 50;">'
);

fs.writeFileSync('index.html', html);
console.log('Fixed z-index');
