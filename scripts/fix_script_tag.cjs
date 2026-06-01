const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('window.onload = function() { window.print(); window.close(); }');
if (sIdx !== -1) {
    const fromIdx = html.lastIndexOf('<script>', sIdx);
    const toIdx = html.indexOf('</script>', sIdx);
    if (fromIdx !== -1 && toIdx !== -1) {
        html = html.substring(0, toIdx) + '<\\\\/script>' + html.substring(toIdx + 9);
        fs.writeFileSync('index.html', html);
        console.log("Fixed");
    }
}
