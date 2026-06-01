const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const s1 = `        } else if (type === "inv") {
          document.getElementById("filter-inv-search").value = "";
          document.getElementById("filter-inv-type").value = "";
          document.getElementById("filter-inv-stockmin").value = "";
          document.getElementById("filter-inv-stockmax").value = "";
          document.getElementById("filter-inv-warning").value = "";
          document.getElementById("sort-inv").value = "";
        }`;
const r1 = `        } else if (type === "inv") {
          document.getElementById("filter-inv-search").value = "";
          document.getElementById("filter-inv-type").value = "";
          document.getElementById("filter-inv-stockmin").value = "";
          document.getElementById("filter-inv-stockmax").value = "";
          document.getElementById("filter-inv-warning").value = "";
          document.getElementById("sort-inv").value = "";
          invSelected.clear();
          const selectAllInv = document.getElementById("inv-select-all");
          if (selectAllInv) {
            selectAllInv.checked = false;
            selectAllInv.indeterminate = false;
          }
        }`;

if (html.includes(s1)) {
    html = html.replace(s1, r1);
    fs.writeFileSync('index.html', html);
    console.log('Fixed inv clear selection');
} else {
    console.log('Not found');
}
