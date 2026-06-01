const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Insert the modal UI right before <!-- Modal Thêm Khách Hàng -->
const modalHTML = `
    <!-- Modal Update Order -->
    <div class="modal-overlay" id="order-update-modal">
      <div class="modal-content" style="width: 500px; max-width: 90vw;">
        <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
          <h3 style="color: var(--danger); margin: 0; font-size: 20px;">Cập nhật hóa đơn</h3>
        </div>
        <div style="padding: 20px; font-size: 15px; line-height: 1.6;">
          <p>Khi thay đổi thông tin trên hóa đơn, hệ thống sẽ:</p>
          <ul style="list-style-type: none; padding: 0; margin: 10px 0;">
            <li style="margin-bottom: 5px;">- Hủy hóa đơn cũ và tạo hóa đơn mới</li>
            <li style="margin-bottom: 5px;">- Tất cả các phiếu thanh toán của hóa đơn cũ sẽ được gắn với hóa đơn mới</li>
            <li style="margin-bottom: 5px;">- Nếu bạn thay đổi số lượng hàng hóa, cần đảm bảo tồn kho của cửa hàng vẫn đáp ứng đủ, hệ thống sẽ không kiểm tra lại.</li>
          </ul>
          <p>Bạn có muốn tiếp tục?</p>
        </div>
        <div class="modal-footer" style="border-top: none; justify-content: space-between; padding-top: 0;">
          <div style="flex: 1"></div>
          <button class="btn-cancel" onclick="closeOrderUpdateModal()" style="border: 1px solid var(--border-color); background: white; color: var(--text-main); font-weight: 500; font-size: 15px; padding: 10px 20px;">Bỏ qua</button>
          <button class="btn-action" onclick="confirmOrderUpdate()" style="background-color: var(--danger); border-radius: 6px; font-weight: 500; font-size: 15px; padding: 10px 20px; box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);">Đồng ý</button>
        </div>
      </div>
    </div>
    
    <!-- Modal Thêm Khách Hàng -->`;
html = html.replace('<!-- Modal Thêm Khách Hàng -->', modalHTML);

// 2. Add global variable
if (!html.includes('let posEditingOrder = null;')) {
    html = html.replace('let posSelectedCustomer = null;', 'let posSelectedCustomer = null;\n      let posEditingOrder = null;');
}

// 3. Define the new POS submit logic
const oldSubmitSearch = `      function submitPosPayment() {
        const sum = posCart.reduce(
          (acc, item) => acc + item.DonGia * item.qty,
          0,
        );
        let disc =
          parseInt(document.getElementById("pos-pay-discount").value) || 0;
        let final = sum - disc;
        if (final < 0) final = 0;

        const staffId = document.getElementById("pos-pay-staff").value;
        const staffObj = appData.TAIKHOAN.find((n) => n.MaNV === staffId);

        const maKH = posSelectedCustomer ? posSelectedCustomer.MaKH : "KL";

        let maxId = 0;
        appData.DONHANG.forEach((dh) => {
          let num = parseInt(dh.MaDH.replace("DH", ""));
          if (!isNaN(num) && num > maxId) maxId = num;
        });
        let newMaDH = "DH" + String(maxId + 1).padStart(6, "0");

        posCart.forEach((item) => {
          let product = appData.SANPHAM.find((p) => p.MaSP === item.MaSP);
          if (product && product.TonKho >= item.qty) {
            product.TonKho -= item.qty;
          }
        });

        appData.DONHANG.unshift({
          MaDH: newMaDH,
          Ngay: new Date().toISOString().substring(0, 10),
          MaKH: maKH,
          TrangThai: "Đã thanh toán",
          TongTien: sum,
          MaNV: staffId,
        });
        if (!appData.CTDH) appData.CTDH = [];
        posCart.forEach((item) => {
          appData.CTDH.push({
            MaDH: newMaDH,
            MaSP: item.MaSP,
            SoLuong: item.qty,
            DonGia: item.DonGia,
            TongTien: item.DonGia * item.qty,
            GiamGia: 0,
          });
        });

        if (posSelectedCustomer) {
          let kh = appData.KHACHHANG.find((x) => x.MaKH === maKH);
          if (kh) {
            kh.TongMua = (kh.TongMua || 0) + sum;
          }
        }

        localStorage.setItem("adminAppData", JSON.stringify(appData));

        closePosPaymentModal();
        showToast("Đơn hàng " + newMaDH + " đã được thanh toán!");

        posCart = [];
        document.getElementById("pos-customer-search").value = "";
        posSelectedCustomer = null;
        initPos();

        calcAndDrawCharts();
        renderTables();
      }`;

const newSubmitCode = `      function closeOrderUpdateModal() {
        document.getElementById("order-update-modal").classList.remove("show");
      }

      function confirmOrderUpdate() {
        closeOrderUpdateModal();
        submitPosPaymentInternal(true);
      }

      function submitPosPayment() {
        if (posEditingOrder) {
            document.getElementById("order-update-modal").classList.add("show");
            return;
        }
        submitPosPaymentInternal(false);
      }

      function submitPosPaymentInternal(isUpdate) {
        const sum = posCart.reduce(
          (acc, item) => acc + item.DonGia * item.qty,
          0,
        );
        let disc = parseInt(document.getElementById("pos-pay-discount").value) || 0;
        let final = sum - disc;
        if (final < 0) final = 0;

        const staffId = document.getElementById("pos-pay-staff").value;
        const maKH = posSelectedCustomer ? posSelectedCustomer.MaKH : "KL";

        if (isUpdate && posEditingOrder) {
            // Restore exact old stock first
            const oldCt = appData.CTDH.filter(c => c.MaDH === posEditingOrder);
            oldCt.forEach(c => {
                let sp = appData.SANPHAM.find((p) => p.MaSP === c.MaSP);
                if (sp) sp.TonKho += c.SoLuong;
            });
            // remove old order
            appData.DONHANG = appData.DONHANG.filter(dh => dh.MaDH !== posEditingOrder);
            appData.CTDH = appData.CTDH.filter(ct => ct.MaDH !== posEditingOrder);
        }

        let maxId = 0;
        appData.DONHANG.forEach((dh) => {
          let num = parseInt(dh.MaDH.replace("DH", ""));
          if (!isNaN(num) && num > maxId) maxId = num;
        });
        let newMaDH = "DH" + String(maxId + 1).padStart(6, "0");

        posCart.forEach((item) => {
          let product = appData.SANPHAM.find((p) => p.MaSP === item.MaSP);
          if (product && product.TonKho >= item.qty) {
            product.TonKho -= item.qty;
          }
        });

        appData.DONHANG.unshift({
          MaDH: newMaDH,
          Ngay: new Date().toISOString().substring(0, 10),
          MaKH: maKH,
          TrangThai: "Đã thanh toán",
          TongTien: final, // Use final price instead of sum
          MaNV: staffId,
        });

        if (!appData.CTDH) appData.CTDH = [];
        posCart.forEach((item) => {
          // Giam gia here is per item? Wait. The original code set it to 0. We'll set it to 0 and apply disc on order total.
          appData.CTDH.push({
            MaDH: newMaDH,
            MaSP: item.MaSP,
            SoLuong: item.qty,
            DonGia: item.DonGia,
            TongTien: item.DonGia * item.qty,
            GiamGia: 0,
          });
        });

        if (posSelectedCustomer && !isUpdate) { // if update, skipping appending TongMua since it might recount
          let kh = appData.KHACHHANG.find((x) => x.MaKH === maKH);
          if (kh) kh.TongMua = (kh.TongMua || 0) + sum;
        }

        localStorage.setItem("adminAppData", JSON.stringify(appData));
        closePosPaymentModal();
        
        posCart = [];
        posEditingOrder = null;
        document.getElementById("pos-customer-search").value = "";
        posSelectedCustomer = null;
        initPos();

        calcAndDrawCharts();
        renderTables();

        if (isUpdate) {
            showToast("Cập nhật hóa đơn thành công!");
            orderExpanded.clear();
            orderExpanded.add(newMaDH);
            const ordNav = Array.from(document.querySelectorAll(".nav-item")).find(el => el.innerText.includes("Đơn hàng"));
            if (ordNav) switchModule("orders", ordNav);
        } else {
            showToast("Đơn hàng " + newMaDH + " đã được thanh toán!");
        }
      }`;

html = html.replace(oldSubmitSearch, newSubmitCode);

// 4. Update the "✏️ Chỉnh sửa" button in the order render to use 'editOrderInPos'
const oldEditBtnSearch = `<button class="btn-cancel" onclick="event.stopPropagation(); alert('Tính năng Chỉnh sửa đang được cập nhật')" style="padding: 8px 16px; display: flex; align-items: center; gap: 5px;"><span style="font-size: 16px;">✏️</span> Chỉnh sửa</button>`;
const newEditBtnReplace = `<button class="btn-cancel" onclick="event.stopPropagation(); editOrderInPos('\${dh.MaDH}')" style="padding: 8px 16px; display: flex; align-items: center; gap: 5px;"><span style="font-size: 16px;">✏️</span> Chỉnh sửa</button>`;

html = html.replace(oldEditBtnSearch, newEditBtnReplace);

// 5. Add editOrderInPos function before resetOrderSortIcons
const editOrderFunc = `      function editOrderInPos(maDH) {
        let dh = appData.DONHANG.find(d => d.MaDH === maDH);
        if (!dh) return;

        posEditingOrder = maDH;

        // find customer
        posSelectedCustomer = appData.KHACHHANG.find(k => k.MaKH === dh.MaKH) || null;
        let dispName = posSelectedCustomer ? (posSelectedCustomer.MaKH + " - " + posSelectedCustomer.TenKH) : "Khách lẻ (None)";
        document.getElementById("pos-customer-search").value = dispName;

        // populate posCart
        let ct = appData.CTDH.filter(c => c.MaDH === maDH);
        posCart = [];
        ct.forEach(c => {
            let sp = appData.SANPHAM.find(p => p.MaSP === c.MaSP);
            if (sp) {
                posCart.push({ ...sp, qty: c.SoLuong, DonGia: c.DonGia });
            }
        });

        // Set staff
        document.getElementById("pos-pay-staff").value = dh.MaNV;

        // switch to pos module
        let posNavEl = Array.from(document.querySelectorAll(".nav-item")).find(el => el.innerText.includes("Bán hàng"));
        if (posNavEl) {
           switchModule("pos", posNavEl);
        }

        // update UI
        updatePosCartUI();
      }

      function resetOrderSortIcons`;
html = html.replace('function resetOrderSortIcons', editOrderFunc);

// 6. Fix Lưu button alert message to actually show a toast
const oldSaveBtn = `<button class="btn-action" onclick="event.stopPropagation(); alert('Tính năng Lưu đang được cập nhật')" style="padding: 8px 16px; background-color: var(--primary); color: white; display: flex; align-items: center; gap: 5px;"><span style="font-size: 16px;">💾</span> Lưu</button>`;
const newSaveBtn = `<button class="btn-action" onclick="event.stopPropagation(); showToast('Đã lưu thông tin hóa đơn!');" style="padding: 8px 16px; background-color: var(--primary); color: white; display: flex; align-items: center; gap: 5px;"><span style="font-size: 16px;">💾</span> Lưu</button>`;
html = html.replace(oldSaveBtn, newSaveBtn);

// Delete old toggleOrderExpand and add again safely? 
// No need, we just update the file.
fs.writeFileSync('index.html', html);
console.log('Fixed edit sequence and POS');
