const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the old select for kind of sort
const oldSortSelect = `<div class="filter-item">
                <label>Sắp xếp theo</label>
                <select id="sort-inv" onchange="renderTables()">
                  <option value="">-- Thuận tự nhiên --</option>
                  <option value="MaSP_asc">Mã SP (Tăng dần)</option>
                  <option value="MaSP_desc">Mã SP (Giảm dần)</option>
                  <option value="Gia_asc">Đơn giá (Thấp - Cao)</option>
                  <option value="Gia_desc">Đơn giá (Cao - Thấp)</option>
                  <option value="Ton_asc">Tồn kho (Thấp - Cao)</option>
                  <option value="Ton_desc">Tồn kho (Cao - Thấp)</option>
                </select>
              </div>`;
html = html.replace(oldSortSelect, "");

// 2. Add sort header clicks
const oldHeader = `<th>Mã SP</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Loại</th>
                    <th>Đơn giá (VNĐ)</th>
                    <th>Tồn kho</th>
                    <th>Cảnh báo</th>
                    <th id="th-inv-action">Hành động</th>`;
                    
const newHeader = `<th onclick="toggleInvSort('MaSP')" style="cursor: pointer">
                      Mã SP <span class="sort-icon-inv" id="sort-inv-MaSP"></span>
                    </th>
                    <th onclick="toggleInvSort('TenSP')" style="cursor: pointer">
                      Tên Sản Phẩm <span class="sort-icon-inv" id="sort-inv-TenSP"></span>
                    </th>
                    <th onclick="toggleInvSort('TenLoaiSP')" style="cursor: pointer">
                      Loại <span class="sort-icon-inv" id="sort-inv-TenLoaiSP"></span>
                    </th>
                    <th onclick="toggleInvSort('DonGia')" style="cursor: pointer">
                      Đơn giá (VNĐ) <span class="sort-icon-inv" id="sort-inv-DonGia"></span>
                    </th>
                    <th onclick="toggleInvSort('TonKho')" style="cursor: pointer">
                      Tồn kho <span class="sort-icon-inv" id="sort-inv-TonKho"></span>
                    </th>
                    <th onclick="toggleInvSort('KhachDat')" style="cursor: pointer">
                      Khách đặt <span class="sort-icon-inv" id="sort-inv-KhachDat"></span>
                    </th>
                    <th>Cảnh báo</th>`;

html = html.replace(oldHeader, newHeader);

// 3. Add script variables and functions for sorting
if (!html.includes('let invSortCol = null;')) {
    html = html.replace('let crmSortCol = null;', 'let crmSortCol = null;\n      let invSortCol = null;\n      let invSortDir = 0;');
}

const jsFunctions = `      function resetInvSortIcons() {
        document.querySelectorAll(".sort-icon-inv").forEach((el) => {
          el.innerHTML = '<span class="up">▲</span><span class="down">▼</span>';
          el.style.opacity = "0.3";
        });
      }

      function toggleInvSort(col) {
        if (invSortCol === col) {
          invSortDir = (invSortDir + 1) % 3;
          if (invSortDir === 0) invSortCol = null;
        } else {
          invSortCol = col;
          invSortDir = 1;
        }
        renderTables();
      }

      function toggleInvSelect(maSP)`;

html = html.replace('function toggleInvSelect(maSP)', jsFunctions);

const searchClearInv = `document.getElementById("sort-inv").value = "";`;
if (html.includes(searchClearInv)) {
    html = html.replace(searchClearInv, 'invSortCol = null;\n          invSortDir = 0;\n          resetInvSortIcons();');
}

// 4. In renderTables for products:
const beforeRenderingProductLoop = `uiFilteredProducts.forEach((sp) => {`;
const newBeforeRenderingProductLoop = `
        // Map quantity ordered by product
        let productOrderedQty = {};
        if (appData.CTDH) {
           appData.CTDH.forEach(ctdh => {
               productOrderedQty[ctdh.MaSP] = (productOrderedQty[ctdh.MaSP] || 0) + ctdh.SoLuong;
           });
        }
        
        uiFilteredProducts.forEach(sp => {
           sp.KhachDat = productOrderedQty[sp.MaSP] || 0;
        });

        // Apply sorting
        if (invSortCol) {
          resetInvSortIcons();
          const iconEl = document.getElementById("sort-inv-" + invSortCol);
          if (iconEl) {
            iconEl.style.opacity = "1";
            if (invSortDir === 1) iconEl.innerHTML = '<span class="up" style="color:var(--primary)">▲</span><span class="down">▼</span>';
            else iconEl.innerHTML = '<span class="up">▲</span><span class="down" style="color:var(--primary)">▼</span>';
          }

          uiFilteredProducts.sort((a, b) => {
            let va = a[invSortCol];
            let vb = b[invSortCol];
            
            if (typeof va === "string") va = va.toLowerCase();
            if (typeof vb === "string") vb = vb.toLowerCase();

            if (va < vb) return invSortDir === 1 ? -1 : 1;
            if (va > vb) return invSortDir === 1 ? 1 : -1;
            return 0;
          });
        }

        uiFilteredProducts.forEach((sp) => {`;

html = html.replace(beforeRenderingProductLoop, newBeforeRenderingProductLoop);

// Remove the old sorting array block
const oldSortingBlock = `        let sInv = document.getElementById("sort-inv")?.value;
        if (sInv === "MaSP_asc")
          uiFilteredProducts.sort((a, b) => a.MaSP.localeCompare(b.MaSP));
        else if (sInv === "MaSP_desc")
          uiFilteredProducts.sort((a, b) => b.MaSP.localeCompare(a.MaSP));
        else if (sInv === "Gia_asc")
          uiFilteredProducts.sort((a, b) => a.DonGia - b.DonGia);
        else if (sInv === "Gia_desc")
          uiFilteredProducts.sort((a, b) => b.DonGia - a.DonGia);
        else if (sInv === "Ton_asc")
          uiFilteredProducts.sort((a, b) => a.TonKho - b.TonKho);
        else if (sInv === "Ton_desc")
          uiFilteredProducts.sort((a, b) => b.TonKho - a.TonKho);`;

html = html.replace(oldSortingBlock, "");


// Update rendering fields for inv row
const tdRowStartSearch = `<td>\${fm(sp.DonGia)}</td><td><b>\${sp.TonKho}</b></td><td>\${textAlert}</td>
           <td onclick="event.stopPropagation()">\${
             !isSales
               ? \`
             <button class="btn-action" style="padding:4px 8px; font-size:12px; margin-right:5px;" onclick="editProduct('\${sp.MaSP}')">Sửa</button>
             <button class="btn-cancel" style="padding:4px 8px; font-size:12px; background-color: var(--danger); color: white;" onclick="deleteProduct('\${sp.MaSP}')">Xóa</button>
           \`
               : ""
           }</td>`;
           
const tdRowStartReplace = `<td>\${fm(sp.DonGia)}</td><td><b>\${sp.TonKho}</b></td><td><b>\${sp.KhachDat || 0}</b></td><td>\${textAlert}</td>`;

html = html.replace(tdRowStartSearch, tdRowStartReplace);


fs.writeFileSync('index.html', html);
console.log('Fixed inv columns and sorting');
