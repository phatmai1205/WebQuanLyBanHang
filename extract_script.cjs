const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/g);
if(scriptMatch) {
    const script = scriptMatch[scriptMatch.length-1].replace(/<script>|<\/script>/g, '');
    fs.writeFileSync('test_script.js', script);
}
