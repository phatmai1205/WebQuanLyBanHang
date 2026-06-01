const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const endRenderSearch = `        document.querySelector("#tbl-san-pham tbody").innerHTML = spHtml;

        // 5. KHÁCH HÀNG`;
const endRenderReplace = `        document.querySelector("#tbl-san-pham tbody").innerHTML = spHtml;

        const selectAllInv = document.getElementById("inv-select-all");
        if (selectAllInv) {
          if (
            uiFilteredProducts.length > 0 &&
            uiFilteredProducts.every((sp) => invSelected.has(sp.MaSP))
          ) {
            selectAllInv.checked = true;
            selectAllInv.indeterminate = false;
          } else if (
            uiFilteredProducts.some((sp) => invSelected.has(sp.MaSP))
          ) {
            selectAllInv.checked = false;
            selectAllInv.indeterminate = true;
          } else {
            selectAllInv.checked = false;
            selectAllInv.indeterminate = false;
          }
        }

        // 5. KHÁCH HÀNG`;

if (html.includes(endRenderSearch)) {
    html = html.replace(endRenderSearch, endRenderReplace);
    fs.writeFileSync('index.html', html);
    console.log('Fixed selectAllInv');
} else {
    console.log('Search string not found');
}
