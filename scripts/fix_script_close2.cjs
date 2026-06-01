const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/<\\\\\/script>\\\\n      <\\\/body>\\\\n      <\\\/html>\\\\`\\);/, 
`</scr\` + \`ipt>
      </body>
      </html>\`);`);

fs.writeFileSync('index.html', html);
