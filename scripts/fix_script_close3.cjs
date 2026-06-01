const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<\\\\\/script>\\n      <\/body>\\n      <\/html>\\\`\);/g;
html = html.replace(regex, "<\\\\/script>\\n      </body>\\n      </html>\\`);");

fs.writeFileSync('index.html', html.replace(/<\\\\\/script>\\\\n      \\\\<\/body>\\\\n      \\\\<\/html>\\\\\`\\\);/g, "<\\\/script>\\n      </body>\\n      </html>`);"));
