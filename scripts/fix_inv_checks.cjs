const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add invSelected state
if (!html.includes('let invSelected = new Set();')) {
    html = html.replace('let invExpanded = new Set();', 'let invExpanded = new Set();\n      let invSelected = new Set();');
}

// 2. Add functions
if (!html.includes('function toggleInvSelect(')) {
    const fnStr = `      function toggleInvSelect(maSP) {
        if (invSelected.has(maSP)) {
          invSelected.delete(maSP);
        } else {
          invSelected.add(maSP);
        }
        renderTables();
      }

      function toggleInvSelectAll(cb) {
        let fInvSearch = document.getElementById("filter-inv-search")?.value.toLowerCase();
        let uiFilteredProducts = [...appData.SANPHAM];
        
        if (fInvSearch) {
          uiFilteredProducts = uiFilteredProducts.filter(
            (sp) => sp.MaSP.toLowerCase().includes(fInvSearch) || sp.TenSP.toLowerCase().includes(fInvSearch)
          );
        }
        
        let fInvType = document.getElementById("filter-inv-type")?.value;
        if (fInvType) uiFilteredProducts = uiFilteredProducts.filter((sp) => sp.TenLoaiSP === fInvType);

        let fInvSMin = document.getElementById("filter-inv-stockmin")?.value;
        let fInvSMax = document.getElementById("filter-inv-stockmax")?.value;
        if (fInvSMin) uiFilteredProducts = uiFilteredProducts.filter((sp) => sp.TonKho >= parseInt(fInvSMin));
        if (fInvSMax) uiFilteredProducts = uiFilteredProducts.filter((sp) => sp.TonKho <= parseInt(fInvSMax));
        
        if (cb.checked) {
          uiFilteredProducts.forEach((sp) => invSelected.add(sp.MaSP));
        } else {
          invSelected.clear();
        }
        renderTables();
      }

      function toggleInvExpand`;
    html = html.replace('function toggleInvExpand', fnStr);
}

// 3. Modifying table HTML
const tableHeaderSearch = `                    <th>Mã SP</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Loại</th>`;
const tableHeaderReplace = `                    <th style="width: 40px; text-align: center">
                      <input
                        type="checkbox"
                        id="inv-select-all"
                        onchange="toggleInvSelectAll(this)"
                      />
                    </th>
                    <th>Mã SP</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Loại</th>`;
html = html.replace(tableHeaderSearch, tableHeaderReplace);

// 4. Modifying table body rendering
const loopStartSearch = `        uiFilteredProducts.forEach((sp) => {
          let isExpanded = invExpanded.has(sp.MaSP);`;
const loopStartReplace = `        uiFilteredProducts.forEach((sp) => {
          let isExpanded = invExpanded.has(sp.MaSP);
          let isChecked = invSelected.has(sp.MaSP) ? "checked" : "";`;
html = html.replace(loopStartSearch, loopStartReplace);

const rowHtmlSearch = `          spHtml += \`<tr class="\${expandedClass}" style="cursor: pointer;" onclick="toggleInvExpand('\${sp.MaSP}')">
           <td>\${sp.MaSP}</td><td><b>\${sp.TenSP}</b></td><td>\${sp.TenLoaiSP}</td>`;
const rowHtmlReplace = `          let ptrEventsCb = \`onclick="event.stopPropagation()"\`;
          spHtml += \`<tr class="\${expandedClass}" style="cursor: pointer;" onclick="toggleInvExpand('\${sp.MaSP}')">
           <td style="text-align: center;" \${ptrEventsCb}><input type="checkbox" \${isChecked} onchange="toggleInvSelect('\${sp.MaSP}')"></td>
           <td>\${sp.MaSP}</td><td><b>\${sp.TenSP}</b></td><td>\${sp.TenLoaiSP}</td>`;
html = html.replace(rowHtmlSearch, rowHtmlReplace);

// Update colspan for expanded row
html = html.replace(/<td colspan="7"/g, '<td colspan="8"');

// 5. Update "Select All" checkbox state
const endRenderSearch = `        document.querySelector("#tbl-san-pham tbody").innerHTML = spHtml;

        // 5. NHÂN SỰ`;
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

        // 5. NHÂN SỰ`;

html = html.replace(endRenderSearch, endRenderReplace);

fs.writeFileSync('index.html', html);
console.log('Fixed inv checkboxes');
