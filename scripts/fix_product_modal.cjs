const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const modalSearch = `<div class="modal-overlay" id="product-modal">
      <div class="modal-content">
        <div class="modal-header">
          <span id="product-modal-title">Thêm Sản Phẩm Mới</span>
          <button class="close-modal" onclick="closeProductModal()">×</button>
        </div>
        <input type="hidden" id="modal-iseditsp" value="0" />

        <div class="form-group">
          <label>Mã Sản Phẩm</label>
          <input
            type="text"
            id="modal-masp"
            maxlength="20"
            placeholder="VD: SP06"
          />
        </div>
        <div class="form-group">
          <label>Tên Sản Phẩm</label>
          <input type="text" id="modal-tensp" placeholder="VD: Bàn phím cơ" />
        </div>
        <div class="form-group">
          <label>Loại Phân Khúc</label>
          <select id="modal-maloaisp">
            <option value="Laptop">Laptop</option>
            <option value="Điện thoại">Điện thoại</option>
            <option value="Phụ kiện">Phụ kiện</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div class="form-group">
          <label>Đơn giá (VNĐ)</label>
          <input type="number" id="modal-dongiasp" value="0" min="0" />
        </div>
        <div class="form-group">
          <label>Số lượng Tồn</label>
          <input type="number" id="modal-tonkhosp" value="0" min="0" />
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" onclick="closeProductModal()">Hủy</button>
          <button class="btn-action" onclick="submitProduct()">Lưu Lưu</button>
        </div>
      </div>
    </div>`;

const newModal = `<div class="modal-overlay" id="product-modal" style="z-index: 10001">
      <div class="modal-content" style="max-width: 900px; width: 90%; background: #f0f2f5; padding: 0; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">
        <div style="background: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color);">
          <span id="product-modal-title" style="font-size: 18px; font-weight: 700; color: #1e293b;">Thêm Hàng Hóa</span>
          <button style="background: none; border: none; font-size: 24px; cursor: pointer; color: #64748b;" onclick="closeProductModal()">×</button>
        </div>
        
        <input type="hidden" id="modal-iseditsp" value="0" />
        <input type="hidden" id="modal-hinh-anh" value="" />

        <div style="padding: 20px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 20px; max-height: calc(100vh - 150px);">
            <!-- Thông tin chung & Hình ảnh -->
            <div style="display: flex; gap: 20px;">
                <!-- Cột trái: Thông tin -->
                <div style="flex: 1; background: white; padding: 20px; border-radius: 6px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 15px;">
                    <div style="display: flex; gap: 15px;">
                        <div style="flex: 1;">
                            <label style="display: block; font-size: 13px; font-weight: 600; color: #475f77; margin-bottom: 5px;">Mã hàng</label>
                            <input type="text" id="modal-masp" placeholder="Mã tự động" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 4px;" />
                        </div>
                    </div>
                    <div>
                        <label style="display: block; font-size: 13px; font-weight: 600; color: #475f77; margin-bottom: 5px;">Tên hàng</label>
                        <input type="text" id="modal-tensp" placeholder="Bắt buộc" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 4px;" />
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                            <label style="font-size: 13px; font-weight: 600; color: #475f77;">Nhóm hàng</label>
                            <a href="javascript:void(0)" onclick="toggleNewCategoryInput()" style="font-size: 13px; color: #0088ff; text-decoration: none; font-weight: 500;">+ Tạo mới</a>
                        </div>
                        
                        <div id="category-select-wrapper">
                            <select id="modal-maloaisp" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 4px;">
                                <!-- Categories dynamically loaded -->
                            </select>
                        </div>
                        
                        <div id="category-input-wrapper" style="display: none; height: 35px; gap: 8px;">
                            <input type="text" id="modal-new-category" placeholder="Nhập tên nhóm hàng mới" style="flex: 1; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 4px;" />
                            <button onclick="saveNewCategory()" style="background: #e2e8f0; border: none; padding: 0 15px; border-radius: 4px; font-weight: 600; color: #334155; cursor: pointer;">Lưu</button>
                            <button onclick="toggleNewCategoryInput()" style="background: none; border: none; font-size: 20px; color: #94a3b8; cursor: pointer;">×</button>
                        </div>
                    </div>
                </div>

                <!-- Cột phải: Hình ảnh -->
                <div style="width: 250px; background: white; padding: 20px; border-radius: 6px; border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
                    <div id="image-preview-container" style="width: 100%; height: 150px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;" onclick="document.getElementById('modal-image-upload').click()">
                        <div id="image-placeholder" style="text-align: center;">
                            <div style="font-size: 24px; color: #94a3b8; margin-bottom: 5px;">📷</div>
                            <div style="font-size: 13px; font-weight: 600; color: #475f77;">Thêm ảnh</div>
                        </div>
                        <img id="image-preview" src="" style="display: none; width: 100%; height: 100%; object-fit: contain;" />
                    </div>
                    <input type="file" id="modal-image-upload" accept="image/*" style="display: none;" onchange="handleProductImageUpload(event)" />
                    <div style="font-size: 11px; color: #94a3b8; text-align: center;">Mỗi ảnh không quá 2 MB</div>
                </div>
            </div>

            <!-- Giá bán -->
            <div style="background: white; padding: 20px; border-radius: 6px; border: 1px solid var(--border-color);">
                <div style="font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 15px;">Giá bán</div>
                <div style="width: 50%;">
                    <label style="display: block; font-size: 13px; font-weight: 600; color: #475f77; margin-bottom: 5px;">Giá bán</label>
                    <input type="number" id="modal-dongiasp" value="0" min="0" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 4px;" />
                </div>
            </div>

            <!-- Tồn kho -->
            <div style="background: white; padding: 20px; border-radius: 6px; border: 1px solid var(--border-color);">
                <div style="font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 15px;">Tồn kho</div>
                <div style="width: 50%;">
                    <label style="display: block; font-size: 13px; font-weight: 600; color: #475f77; margin-bottom: 5px;">Tồn kho</label>
                    <input type="number" id="modal-tonkhosp" value="0" min="0" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 4px;" />
                </div>
            </div>
        </div>

        <div style="background: white; padding: 15px 20px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 10px;">
            <button onclick="closeProductModal()" style="padding: 8px 16px; background: white; border: 1px solid var(--border-color); border-radius: 4px; font-weight: 600; color: #475f77; cursor: pointer;">Bỏ qua</button>
            <button onclick="submitProduct()" style="padding: 8px 24px; background: #4b6584; border: none; border-radius: 4px; font-weight: 600; color: white; cursor: pointer;">Lưu</button>
        </div>
      </div>
    </div>`;

html = html.replace(modalSearch, newModal);
fs.writeFileSync('index.html', html);
console.log('Modal layout updated');
