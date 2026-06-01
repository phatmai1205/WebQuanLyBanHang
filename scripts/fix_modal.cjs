const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const modalHTML = `
    <!-- Modal Update Order -->
    <div class="modal-overlay" id="order-update-modal" style="z-index: 3000;">
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
    
    <!-- Modal POS Thanh Toán -->`;

html = html.replace('<!-- Modal POS Thanh Toán -->', modalHTML);
fs.writeFileSync('index.html', html);
console.log('Added order-update-modal');
