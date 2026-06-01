const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add orderExpanded
if (!html.includes('let orderExpanded = new Set();')) {
    html = html.replace('let invExpanded = new Set();', 'let orderExpanded = new Set();\n      let invExpanded = new Set();');
}

// 2. Add toggle function
const jsToggle = `      function toggleOrderExpand(maDH) {
        if (orderExpanded.has(maDH)) orderExpanded.delete(maDH);
        else orderExpanded.add(maDH);
        renderTables();
      }

      function toggleOrderSelect`;
if (!html.includes('function toggleOrderExpand')) {
    html = html.replace('function toggleOrderSelect', jsToggle);
}

// 3. Update the loop
const oldLoop = `        let dhHtml = "";
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

const newLoop = `        let dhHtml = "";
        uiFilteredOrders.forEach((dh) => {
          let badge =
            dh.TrangThai === "Đã thanh toán" ? "badge-success" : "badge-danger";
          if (dh.TrangThai === "Trả góp") badge = "badge-dark";

          let isChecked = orderSelected.has(dh.MaDH) ? "checked" : "";
          let isExpanded = orderExpanded.has(dh.MaDH);
          let expandedClass = isExpanded ? "expanded" : "";

          // Remove viewOrderDetails modal trigger and replace with toggleOrderExpand
          dhHtml += \`<tr class="crm-row \${expandedClass}" style="cursor: pointer;" onclick="toggleOrderExpand('\${dh.MaDH}')">
            <td style="text-align: center;" onclick="event.stopPropagation()"><input type="checkbox" \${isChecked} onchange="toggleOrderSelect('\${dh.MaDH}')"></td>
            <td><b>\${dh.MaDH}</b></td><td>\${dh.Ngay}</td><td>\${dh.MaKH} - \${dh.TenKH}</td>
             <td><b>\${fm(dh.TienHang)}</b> đ</td>
            <td><b>\${fm(dh.GiamGia)}</b> đ</td>
            <td><b>\${fm(dh.DaTra)}</b> đ</td>
         </tr>\`;

          if (isExpanded) {
            let ct = appData.CTDH ? appData.CTDH.filter(c => c.MaDH === dh.MaDH) : [];
            let itemsHtml = "";
            let tongTienHang = 0;
            let tongGiamGia = 0;
            
            ct.forEach(c => {
                let spData = appData.SANPHAM.find(p => p.MaSP === c.MaSP);
                let tenSP = spData ? spData.TenSP : "Sản phẩm không xác định";
                let thanhTien = c.DonGia * c.SoLuong - (c.DonGia * c.SoLuong * (c.GiamGia || 0));
                tongTienHang += c.DonGia * c.SoLuong;
                tongGiamGia += c.DonGia * c.SoLuong * (c.GiamGia || 0);

                itemsHtml += \`<tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 12px 16px; color: var(--primary);">\${c.MaSP}</td>
                    <td style="padding: 12px 16px;">\${tenSP}</td>
                    <td style="padding: 12px 16px; text-align: center;">\${c.SoLuong}</td>
                    <td style="padding: 12px 16px; text-align: right;">\${fm(c.DonGia)}</td>
                    <td style="padding: 12px 16px; text-align: right;">\${(c.GiamGia || 0) * 100}%</td>
                    <td style="padding: 12px 16px; text-align: right;">\${fm(thanhTien)}</td>
                </tr>\`;
            });

            let btnHuy = !isSales ? \`<button class="btn-cancel" onclick="event.stopPropagation(); deleteOrder('\${dh.MaDH}')" style="background:none; border:none; color:var(--text-secondary); font-size:14px; font-weight:600; cursor:pointer; padding:8px 12px; display:flex; align-items:center; gap:5px;"><span style="font-size:16px">🗑</span> Hủy</button>\` : "";

            dhHtml += \`<tr class="crm-expanded-row" style="background-color: #fcfcfd;">
                <td colspan="7" style="padding: 20px;">
                   <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 0; cursor: default; display: flex; flex-direction: column;" onclick="event.stopPropagation()">
                      
                      <!-- Header Tabs -->
                      <div style="display: flex; gap: 20px; border-bottom: 1px solid var(--border-color); padding: 0 20px;">
                          <div style="padding: 15px 0; border-bottom: 2px solid var(--primary); color: var(--primary); font-weight: 600;">Thông tin</div>
                          <div style="padding: 15px 0; color: var(--text-secondary); font-weight: 500; cursor: pointer;">Lịch sử thanh toán</div>
                      </div>

                      <!-- Title Row -->
                      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 20px 10px 20px;">
                          <div style="display: flex; align-items: center; gap: 10px;">
                              <span style="font-size: 20px; font-weight: bold;">\${dh.TenKH || dh.MaKH}</span>
                              <span style="color: var(--primary); cursor: pointer;">\u2197</span>
                              <span style="color: var(--text-secondary);">\${dh.MaDH}</span>
                              <span class="badge \${badge}" style="font-size: 13px;">\${dh.TrangThai}</span>
                          </div>
                          <div style="color: var(--text-secondary);">Chi nhánh trung tâm</div>
                      </div>

                      <!-- Info Grid -->
                      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; padding: 10px 20px 20px 20px; border-bottom: 1px solid #edf2f7; font-size: 14px;">
                          <div style="display: flex; gap: 10px;">
                              <span style="color: var(--text-secondary); width: 80px;">Người tạo:</span>
                              <span>\${dh.MaNV}</span>
                          </div>
                          <div style="display: flex; gap: 10px;">
                              <span style="color: var(--text-secondary); width: 80px;">Người bán:</span>
                              <select style="padding: 4px 8px; border: 1px solid var(--border-color); border-radius: 4px;"><option>\${dh.MaNV}</option></select>
                          </div>
                          <div style="display: flex; gap: 10px; align-items: center;">
                              <span style="color: var(--text-secondary); width: 80px;">Ngày bán:</span>
                              <span style="background: #f8fafc; padding: 4px 8px; border-radius: 4px; border: 1px solid #edf2f7;">\${dh.Ngay} \uD83D\uDCC6 \uD83D\uDD52</span>
                          </div>
                      </div>

                      <!-- Items Table -->
                      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                          <thead>
                              <tr style="background-color: #f8fafc; text-align: left;">
                                  <th style="padding: 12px 16px; font-weight: 600; border-bottom: 1px solid #edf2f7;">Mã hàng</th>
                                  <th style="padding: 12px 16px; font-weight: 600; border-bottom: 1px solid #edf2f7;">Tên hàng</th>
                                  <th style="padding: 12px 16px; font-weight: 600; text-align: center; border-bottom: 1px solid #edf2f7;">Số lượng</th>
                                  <th style="padding: 12px 16px; font-weight: 600; text-align: right; border-bottom: 1px solid #edf2f7;">Đơn giá</th>
                                  <th style="padding: 12px 16px; font-weight: 600; text-align: right; border-bottom: 1px solid #edf2f7;">Giảm giá</th>
                                  <th style="padding: 12px 16px; font-weight: 600; text-align: right; border-bottom: 1px solid #edf2f7;">Thành tiền</th>
                              </tr>
                          </thead>
                          <tbody>
                              \${itemsHtml}
                          </tbody>
                      </table>

                      <!-- Bottom Summary -->
                      <div style="display: flex; gap: 20px; padding: 20px;">
                          <div style="flex: 1;">
                              <textarea placeholder="Ghi chú..." style="width: 100%; height: 100px; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: inherit; font-size: 14px; resize: none;"></textarea>
                          </div>
                          <div style="width: 300px; font-size: 14px;">
                              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                  <span style="color: var(--text-secondary);">Tổng tiền hàng (\${ct.reduce((acc, c) => acc + c.SoLuong, 0)})</span>
                                  <span style="font-weight: 500;">\${fm(tongTienHang)}</span>
                              </div>
                              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                  <span style="color: var(--text-secondary);">Giảm giá hóa đơn</span>
                                  <span style="font-weight: 500;">\${fm(tongGiamGia)}</span>
                              </div>
                              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                  <span style="color: var(--text-secondary);">Khách cần trả</span>
                                  <span style="font-weight: bold; font-size: 16px;">\${fm(tongTienHang - tongGiamGia)}</span>
                              </div>
                              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                  <span style="color: var(--text-secondary);">Khách đã trả</span>
                                  <span style="font-weight: bold; font-size: 16px;">\${fm(dh.DaTra)}</span>
                              </div>
                          </div>
                      </div>

                      <!-- Actions -->
                      <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-top: 1px solid var(--border-color); background-color: white; border-radius: 0 0 8px 8px;">
                          <div>
                              \${btnHuy}
                          </div>
                          <div style="display: flex; gap: 10px;">
                              <button class="btn-cancel" onclick="event.stopPropagation(); alert('Tính năng Chỉnh sửa đang được cập nhật')" style="padding: 8px 16px; display: flex; align-items: center; gap: 5px;"><span style="font-size: 16px;">✏️</span> Chỉnh sửa</button>
                              <button class="btn-action" onclick="event.stopPropagation(); alert('Tính năng Lưu đang được cập nhật')" style="padding: 8px 16px; background-color: var(--primary); color: white; display: flex; align-items: center; gap: 5px;"><span style="font-size: 16px;">💾</span> Lưu</button>
                          </div>
                      </div>
                      
                   </div>
                </td>
             </tr>\`;
          }
        });`;

html = html.replace(oldLoop, newLoop);

fs.writeFileSync('index.html', html);
console.log('Fixed Order Table Details Expand');
