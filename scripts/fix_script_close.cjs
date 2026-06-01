const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/<\/script>\n      <\/body>\n      <\/html>`\);/g, '<\\/script>\\n      </body>\\n      </html>\\`);');

fs.writeFileSync('index.html', html);
