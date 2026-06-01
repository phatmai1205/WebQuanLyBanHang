const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf-8');
const s = content.indexOf('const DEFAULT_DATA = {');
let braces = 0;
let jsonStr = '';
let inStr = false;
for (let i = s + 21; i < content.length; i++) {
  const char = content[i];
  if (char === '"' && content[i-1] !== '\\') inStr = !inStr;
  jsonStr += char;
  if (!inStr) {
    if (char === '{') braces++;
    if (char === '}') braces--;
  }
  if (braces === 0) break;
}
const obj = eval('(' + jsonStr + ')');
fs.writeFileSync('temp_default_data.json', JSON.stringify(obj, null, 2));
