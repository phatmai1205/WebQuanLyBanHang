const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('let invExpanded = new Set();')) {
    html = html.replace('let crmExpanded = new Set();', 'let crmExpanded = new Set();\n      let invExpanded = new Set();');
}

if (!html.includes('function toggleInvExpand(maSP)')) {
    html = html.replace('function toggleCrmExpand(maKH)', 'function toggleInvExpand(maSP) {\n        if (invExpanded.has(maSP)) invExpanded.delete(maSP);\n        else invExpanded.add(maSP);\n        renderTables();\n      }\n\n      function toggleCrmExpand(maKH)');
}

const tableSearch = `        let spHtml = "";
        uiFilteredProducts.forEach((sp) => {`;

const tableReplace = `        let spHtml = "";
        uiFilteredProducts.forEach((sp) => {
          let isExpanded = invExpanded.has(sp.MaSP);
          let expandedClass = isExpanded ? "expanded" : "";`;

html = html.replace(tableSearch, tableReplace);

const rowSearch = `          spHtml += \`<tr>
            <td>\${sp.MaSP}</td><td><b>\${sp.TenSP}</b></td><td>\${sp.TenLoaiSP}</td>
            <td>\${fm(sp.DonGia)}</td><td><b>\${sp.TonKho}</b></td><td>\${textAlert}</td>
            \${actionTd}
          </tr>\`;`;

const rowReplace = `          spHtml += \`<tr class="\${expandedClass}" style="cursor: pointer;" onclick="toggleInvExpand('\${sp.MaSP}')">
            <td>\${sp.MaSP}</td><td><b>\${sp.TenSP}</b></td><td>\${sp.TenLoaiSP}</td>
            <td>\${fm(sp.DonGia)}</td><td><b>\${sp.TonKho}</b></td><td>\${textAlert}</td>
            <td onclick="event.stopPropagation()">\${isSales ? "" : \`
              <button class="btn-action" style="padding:4px 8px; font-size:12px; margin-right:5px;" onclick="editProduct('\${sp.MaSP}')">Sửa</button>
              <button class="btn-cancel" style="padding:4px 8px; font-size:12px; background-color: var(--danger); color: white;" onclick="deleteProduct('\${sp.MaSP}')">Xóa</button>
            \`}</td>
          </tr>\`;

          if (isExpanded) {
              let imgUrl = sp.HinhAnh && sp.HinhAnh.startsWith('data:') ? sp.HinhAnh : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23ddd"/><text x="30" y="55" fill="%23555" font-family="sans-serif" font-size="16">IMG</text></svg>';
              let delBtn = !isSales ? \`<button class="btn-cancel" onclick="event.stopPropagation(); deleteProduct('\${sp.MaSP}')" style="background:none; border:none; color:var(--danger); font-size:14px; font-weight:600; cursor:pointer; padding:5px 10px; display:flex; align-items:center; gap:5px;"><span style="font-size:16px">🗑️</span> Xóa</button>\` : '';
              
              spHtml += \`<tr class="inv-expanded-row" style="background-color: #fcfcfd;">
                 <td colspan="7" style="padding: 20px;">
                    <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 25px; cursor: default;" onclick="event.stopPropagation()">
                       
                       <div style="display:flex; gap: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px; font-size:14px; font-weight:600; color:var(--text-muted);">
                           <div style="color:#4b6584; border-bottom:2px solid #4b6584; padding-bottom:10px; margin-bottom:-11px;">Thông tin</div>
                       </div>

                       <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                           <div style="width: 100px; height: 100px; border-radius: 8px; background: #e2e8f0; display:flex; align-items:center; justify-content:center; flex-shrink: 0; overflow:hidden;">
                               <img src="\${imgUrl}" style="width:100%; height:100%; object-fit:cover;">
                           </div>
                           <div style="flex: 1;">
                               <div style="font-size: 20px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">\${sp.TenSP}</div>
                               <div style="font-size: 14px; color: var(--text-muted); display:flex; gap:15px; margin-bottom: 15px;">
                                   <span>Nhóm hàng: <span style="color:var(--text-main)">\${sp.TenLoaiSP}</span></span>
                               </div>
                               <div style="display: flex; gap: 10px;">
                                   <span style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Hàng hóa thường</span>
                                   <span style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Bán trực tiếp</span>
                               </div>
                           </div>
                       </div>

                       <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; padding-bottom:20px;">
                           <div>
                               <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Mã hàng</div>
                               <div style="font-size:14px; color:var(--text-main); font-weight:700;">\${sp.MaSP}</div>
                           </div>
                           <div>
                               <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Giá bán</div>
                               <div style="font-size:14px; color:var(--text-main); font-weight:700;">\${fm(sp.DonGia)}</div>
                           </div>
                       </div>

                       <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top:20px;">
                           <div>\${delBtn}</div>
                           <div style="display:flex; gap:10px;">
                              <button class="btn-action" style="background:#4b6584; border-radius: 6px; padding: 8px 15px;" onclick="event.stopPropagation(); editProduct('\${sp.MaSP}')"><span style="margin-right:5px">✏️</span> Chỉnh sửa</button>
                           </div>
                       </div>
                    </div>
                 </td>
              </tr>\`;
          }`;

html = html.replace(rowSearch, rowReplace);

fs.writeFileSync('index.html', html);
console.log('Kho updated');
