const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove old sorting dropdown
const oldOrderSort = `<div class="filter-item">
                <label>Sắp xếp theo</label>
                <select id="sort-order" onchange="renderTables()">
                  <option value="">-- Thuận gốc --</option>
                  <option value="Ngay_desc">Ngày (Mới nhất)</option>
                  <option value="Ngay_asc">Ngày (Cũ nhất)</option>
                  <option value="Tien_desc">Tổng tiền (Cao - Thấp)</option>
                  <option value="Tien_asc">Tổng tiền (Thấp - Cao)</option>
                </select>
              </div>`;
html = html.replace(oldOrderSort, "");

// 2. Add header
const oldOrderHeader = `<th>Mã Đơn</th>
                    <th>Ngày đặt</th>
                    <th>Khách hàng</th>
                    <th>Trạng thái</th>
                    <th>Thu Ngân (Sale)</th>
                    <th>Tổng Tiền</th>
                    <th>Hành động</th>`;
const newOrderHeader = `<th style="width: 40px; text-align: center">
                      <input
                        type="checkbox"
                        id="order-select-all"
                        onchange="toggleOrderSelectAll(this)"
                      />
                    </th>
                    <th onclick="toggleOrderSort('MaDH')" style="cursor: pointer">
                      Mã đơn <span class="sort-icon-order" id="sort-order-MaDH"></span>
                    </th>
                    <th onclick="toggleOrderSort('Ngay')" style="cursor: pointer">
                      Ngày đặt <span class="sort-icon-order" id="sort-order-Ngay"></span>
                    </th>
                    <th onclick="toggleOrderSort('TenKH')" style="cursor: pointer">
                      Khách hàng <span class="sort-icon-order" id="sort-order-TenKH"></span>
                    </th>
                    <th onclick="toggleOrderSort('TienHang')" style="cursor: pointer">
                      Tổng tiền hàng <span class="sort-icon-order" id="sort-order-TienHang"></span>
                    </th>
                    <th onclick="toggleOrderSort('GiamGia')" style="cursor: pointer">
                      Giảm giá <span class="sort-icon-order" id="sort-order-GiamGia"></span>
                    </th>
                    <th onclick="toggleOrderSort('DaTra')" style="cursor: pointer">
                      Khách đã trả <span class="sort-icon-order" id="sort-order-DaTra"></span>
                    </th>`;
html = html.replace(oldOrderHeader, newOrderHeader);

// 3. Add variables
if (!html.includes('let orderSortCol = null;')) {
    html = html.replace('let invSortCol = null;', 'let invSortCol = null;\n      let orderSortCol = null;\n      let orderSortDir = 0;\n      let orderSelected = new Set();');
}

// 4. Update clearFilters('order')
const oldClearOrder = `          document.getElementById("sort-order").value = "";`;
const newClearOrder = `          orderSortCol = null;
          orderSortDir = 0;
          orderSelected.clear();
          resetOrderSortIcons();
          const orderSelAll = document.getElementById("order-select-all");
          if (orderSelAll) {
            orderSelAll.checked = false;
            orderSelAll.indeterminate = false;
          }`;
html = html.replace(oldClearOrder, newClearOrder);

// 5. Build JS functions
const jsFunctions = `      function resetOrderSortIcons() {
        document.querySelectorAll(".sort-icon-order").forEach((el) => {
          el.innerHTML = '<span class="up">▲</span><span class="down">▼</span>';
          el.style.opacity = "0.3";
        });
      }

      function toggleOrderSort(col) {
        if (orderSortCol === col) {
          orderSortDir = (orderSortDir + 1) % 3;
          if (orderSortDir === 0) orderSortCol = null;
        } else {
          orderSortCol = col;
          orderSortDir = 1;
        }
        renderTables();
      }

      function toggleOrderSelect(maDH) {
        if (orderSelected.has(maDH)) {
          orderSelected.delete(maDH);
        } else {
          orderSelected.add(maDH);
        }
        renderTables();
      }

      function toggleOrderSelectAll(cb) {
        // filter orders
        let uiFilteredOrders = [...appData.DONHANG];
        if (cb.checked) {
          uiFilteredOrders.forEach((dh) => orderSelected.add(dh.MaDH));
        } else {
          orderSelected.clear();
        }
        renderTables();
      }

      function resetInvSortIcons`;
html = html.replace('function resetInvSortIcons', jsFunctions);

// 6. Rendering logic and sorting
const oldRenderSort = `// Sort
        let sOrd = document.getElementById("sort-order")?.value;
        if (sOrd === "Ngay_desc")
          uiFilteredOrders.sort((a, b) => new Date(b.Ngay) - new Date(a.Ngay));
        else if (sOrd === "Ngay_asc")
          uiFilteredOrders.sort((a, b) => new Date(a.Ngay) - new Date(b.Ngay));
        else if (sOrd === "Tien_desc")
          uiFilteredOrders.sort((a, b) => b.TongTien - a.TongTien);
        else if (sOrd === "Tien_asc")
          uiFilteredOrders.sort((a, b) => a.TongTien - b.TongTien);`;

const newRenderSort = `// Enrich order records
        uiFilteredOrders.forEach((dh) => {
          let khObj = appData.KHACHHANG.find((k) => k.MaKH === dh.MaKH);
          dh.TenKH = khObj ? khObj.TenKH : "";
          
          let ct = appData.CTDH ? appData.CTDH.filter(c => c.MaDH === dh.MaDH) : [];
          if (ct.length > 0) {
              let tienhang = 0;
              let giamgia = 0;
              ct.forEach(c => {
                  tienhang += c.DonGia * c.SoLuong;
                  giamgia += c.DonGia * c.SoLuong * (c.GiamGia || 0);
              });
              dh.TienHang = tienhang;
              dh.GiamGia = giamgia;
          } else {
              dh.TienHang = dh.TongTien;
              dh.GiamGia = 0;
          }
          
          let tonsaugiam = dh.TienHang - dh.GiamGia;
          if (dh.TrangThai === "Đã thanh toán") dh.DaTra = tonsaugiam;
          else if (dh.TrangThai === "Chưa thanh toán") dh.DaTra = 0;
          else dh.DaTra = tonsaugiam * 0.3; // fallback 30% for others e.g. Trả góp
        });

        // Apply sorting
        if (orderSortCol) {
          resetOrderSortIcons();
          const iconEl = document.getElementById("sort-order-" + orderSortCol);
          if (iconEl) {
            iconEl.style.opacity = "1";
            if (orderSortDir === 1) {
              iconEl.innerHTML = '<span class="up" style="color:var(--text-main); font-weight:bold;">▲</span><span class="down">▼</span>';
            } else {
              iconEl.innerHTML = '<span class="up">▲</span><span class="down" style="color:var(--text-main); font-weight:bold;">▼</span>';
            }
          }

          uiFilteredOrders.sort((a, b) => {
            let va = a[orderSortCol];
            let vb = b[orderSortCol];
            
            if (orderSortCol === "Ngay") {
               va = new Date(va).getTime();
               vb = new Date(vb).getTime();
            } else {
                if (typeof va === "string") va = va.toLowerCase();
                if (typeof vb === "string") vb = vb.toLowerCase();
            }

            if (va < vb) return orderSortDir === 1 ? -1 : 1;
            if (va > vb) return orderSortDir === 1 ? 1 : -1;
            return 0;
          });
        } else {
          resetOrderSortIcons();
        }`;
html = html.replace(oldRenderSort, newRenderSort);

// 7. Render html loop
const oldHtmlLoopMatch = `        let dhHtml = "";
        uiFilteredOrders.forEach((dh) => {
          let badge =
            dh.TrangThai === "Đã thanh toán" ? "badge-success" : "badge-danger";
          if (dh.TrangThai === "Trả góp") badge = "badge-dark";

          let khObj = appData.KHACHHANG.find((k) => k.MaKH === dh.MaKH);
          let tenKH = khObj ? khObj.TenKH : "";

          let btnXoa = !isSales
            ? \`<button class="btn-cancel" style="padding:4px 8px; font-size:12px; background-color: var(--danger); color: white;" onclick="deleteOrder('\${dh.MaDH}')">Xóa</button>\`
            : "";

          dhHtml += \`<tr>
            <td><b>\${dh.MaDH}</b></td><td>\${dh.Ngay}</td><td>\${dh.MaKH} - \${tenKH}</td>
            <td><span class="badge \${badge}">\${dh.TrangThai}</span></td>
            <td>\${dh.MaNV}</td>
            <td><b>\${fm(dh.TongTien)}</b> đ</td>
            <td>
              <button class="btn-action" style="padding:4px 8px; font-size:12px; margin-right:5px;" onclick="viewOrderDetails('\${dh.MaDH}')">Xem</button>
              \${btnXoa}
            </td>
         </tr>\`;
        });`;

const newHtmlLoopMatch = `        let dhHtml = "";
        uiFilteredOrders.forEach((dh) => {
          let badge =
            dh.TrangThai === "Đã thanh toán" ? "badge-success" : "badge-danger";
          if (dh.TrangThai === "Trả góp") badge = "badge-dark";

          let isChecked = orderSelected.has(dh.MaDH) ? "checked" : "";
          dhHtml += \`<tr style="cursor: pointer;" onclick="viewOrderDetails('\${dh.MaDH}')">
            <td style="text-align: center;" onclick="event.stopPropagation()"><input type="checkbox" \${isChecked} onchange="toggleOrderSelect('\${dh.MaDH}')"></td>
            <td><b>\${dh.MaDH}</b></td><td>\${dh.Ngay}</td><td>\${dh.MaKH} - \${dh.TenKH}</td>
             <td><b>\${fm(dh.TienHang)}</b> đ</td>
            <td><b>\${fm(dh.GiamGia)}</b> đ</td>
            <td><b>\${fm(dh.DaTra)}</b> đ</td>
         </tr>\`;
        });`;
         
html = html.replace(oldHtmlLoopMatch, newHtmlLoopMatch);

// Add select-all indeterminate logic after setting HTML
const oldAppendTbody = `document.querySelector("#tbl-don-hang tbody").innerHTML = dhHtml;`;
const newAppendTbody = `document.querySelector("#tbl-don-hang tbody").innerHTML = dhHtml;
        const selectAllOrder = document.getElementById("order-select-all");
        if (selectAllOrder) {
          if (
            uiFilteredOrders.length > 0 &&
            uiFilteredOrders.every((dh) => orderSelected.has(dh.MaDH))
          ) {
            selectAllOrder.checked = true;
            selectAllOrder.indeterminate = false;
          } else if (
            uiFilteredOrders.some((dh) => orderSelected.has(dh.MaDH))
          ) {
            selectAllOrder.checked = false;
            selectAllOrder.indeterminate = true;
          } else {
            selectAllOrder.checked = false;
            selectAllOrder.indeterminate = false;
          }
        }`;
html = html.replace(oldAppendTbody, newAppendTbody);


fs.writeFileSync('index.html', html);
console.log('Fixed DH table sorting');
