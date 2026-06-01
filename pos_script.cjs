const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

if(!html.includes('id="module-pos"')) {
    html = html.replace('<div class="sidebar-footer">', `        <div class="nav-item" onclick="switchModule('pos', this)" style="margin-bottom: 5px;">
          <span class="nav-icon">🛒</span><span class="nav-text">Bán hàng</span>
        </div>
        <div class="sidebar-footer">`);

    const endOfSections = `        </section>

      </div>
    </main>`;

    const posStyles = `
<style>
#module-pos {
    display: none;
    height: 100%;
    flex-direction: column;
}
#module-pos.active {
    display: flex;
}
.pos-container {
    display: flex;
    gap: 15px;
    height: calc(100vh - 100px);
    overflow: hidden;
}
.pos-left {
    flex: 2;
    background: white;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-water);
}
.pos-right {
    flex: 3;
    background: white;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-water);
}
.pos-right-header {
    padding: 10px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    gap: 10px;
    align-items: center;
}
.pos-products-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    display: grid;
    gap: 10px;
    align-content: start;
}
.pos-products-list.grid-view {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
}
.pos-products-list.list-view {
    grid-template-columns: 1fr;
}
.pos-product-item {
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
}
.grid-view .pos-product-item {
    flex-direction: column;
    text-align: center;
}
.list-view .pos-product-item {
    flex-direction: row;
    align-items: center;
    gap: 12px;
}
.pos-product-item:hover {
    border-color: var(--accent);
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.pos-product-img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    margin: 0 auto 8px auto;
}
.list-view .pos-product-img {
    margin: 0;
}
.pos-product-name {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.list-view .pos-product-name {
    flex: 1;
    -webkit-line-clamp: 1;
}
.pos-product-price {
    color: var(--danger);
    font-weight: 600;
    font-size: 13px;
}
.pos-cart-list {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
}
.pos-cart-item {
    display: flex;
    align-items: flex-start;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px dashed var(--border-color);
}
.pos-cart-item:last-child {
    border-bottom: none;
}
.pos-cart-index {
    width: 25px;
    font-weight: 600;
    color: #666;
}
.pos-cart-del {
    color: var(--danger);
    cursor: pointer;
    margin-right: 15px;
    font-size: 16px;
}
.pos-cart-details {
    flex: 1;
}
.pos-cart-top {
    display: flex;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
}
.pos-cart-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.pos-qty-input {
    width: 60px;
    text-align: center;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 4px;
    color: var(--danger);
    font-weight: 600;
}
.pos-cart-price {
    font-weight: 600;
}
.pos-cart-summary {
    padding: 15px;
    border-top: 1px solid var(--border-color);
    background: #fafbfe;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
}
.pos-right-footer {
    padding: 15px;
    border-top: 1px solid var(--border-color);
}
.btn-pay {
    width: 100%;
    background: #475f77;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
}
.btn-pay:hover {
    background: #364a5d;
}
/* Customer search */
.pos-search-wrapper {
    position: relative;
    flex: 1;
}
.pos-search-wrapper input {
    width: 100%;
    padding: 8px 12px 8px 30px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 13px;
}
.pos-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
}
.pos-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: #555;
    padding: 5px;
}
.pos-icon-btn:hover {
    color: var(--accent);
}
</style>
        <section id="module-pos" class="section-module" style="padding: 0; background: transparent;">
            <div class="pos-container">
                <!-- Left: Cart -->
                <div class="pos-left">
                    <div class="pos-cart-list" id="pos-cart-list">
                        <!-- Items injected here -->
                    </div>
                    <div class="pos-cart-summary">
                        <div>Tổng tiền hàng (<span id="pos-total-items">0</span>)</div>
                        <div id="pos-total-price">0</div>
                    </div>
                </div>

                <!-- Right: Products -->
                <div class="pos-right">
                    <div class="pos-right-header">
                        <div class="pos-search-wrapper">
                            <span class="pos-search-icon">🔍</span>
                            <input type="text" id="pos-customer-search" placeholder="Tìm khách hàng..." oninput="posSearchCustomer()" autocomplete="off">
                            <div id="pos-customer-suggest" class="autocomplete-list" style="display:none; position:absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid var(--border-color); border-radius: 6px; max-height: 200px; overflow-y: auto; z-index: 100; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);"></div>
                        </div>
                        <button class="pos-icon-btn" onclick="openCustomerModal()" title="Thêm khách hàng mới">+</button>
                        <button class="pos-icon-btn" onclick="openPosFilterModal()" title="Lọc theo nhóm hàng">☰</button>
                        <button class="pos-icon-btn" id="pos-view-toggle" onclick="togglePosViewMode()" title="Chế độ xem">🖼️</button>
                    </div>
                    
                    <div class="pos-products-list grid-view" id="pos-products-list">
                        <!-- Products injected here -->
                    </div>

                    <div class="pos-right-footer">
                        <button class="btn-pay" onclick="openPosPaymentModal()">THANH TOÁN</button>
                    </div>
                </div>
            </div>
        </section>
`;

    html = html.replace(endOfSections, posStyles + endOfSections);

    const posModals = `
<!-- Modal POS Lọc Nhóm Hàng -->
<div class="modal-overlay" id="pos-filter-modal" style="z-index: 2500;">
  <div class="modal-content" style="width: 400px; max-height: 80vh; display: flex; flex-direction: column;">
    <div class="modal-header">
      <span>Lọc theo nhóm hàng</span>
      <button class="close-modal" onclick="closePosFilterModal()">&times;</button>
    </div>
    <div style="flex:1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;" id="pos-filter-categories">
        <!-- Checkboxes for groups injected here -->
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 15px;">
        <button class="btn-action" style="background: transparent; color: var(--text-main); border: 1px solid var(--border-color);" onclick="resetPosFilter()">Bỏ qua</button>
        <button class="btn-action" onclick="applyPosFilter()">Xong</button>
    </div>
  </div>
</div>

<!-- Modal POS Thanh Toán -->
<div class="modal-overlay" id="pos-payment-modal" style="z-index: 2500;">
  <div class="modal-content" style="width: 600px; padding:0; display:flex; flex-direction: column;">
    <div style="padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-color);">
        <div style="display: flex; gap: 10px; align-items: center;">
            <select id="pos-pay-staff" style="padding: 6px; border-radius: 4px; border: 1px solid var(--border-color); outline: none;">
                <!-- Staff options -->
            </select>
        </div>
        <div style="display: flex; gap: 10px; align-items: center; font-size: 13px; color: #555;">
            <span id="pos-pay-date"></span>
            <button class="close-modal" onclick="closePosPaymentModal()" style="width:24px; height:24px; border:none; background:transparent; font-size:20px;">&times;</button>
        </div>
    </div>
    
    <div style="padding: 20px;">
        <div style="font-weight: 700; font-size: 16px; margin-bottom: 20px;" id="pos-pay-customer-name">Khách lẻ</div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <span>Tổng tiền hàng</span>
            <div style="display: flex; gap: 10px;">
                <span id="pos-pay-total-qty"></span>
                <span id="pos-pay-total-price" style="font-weight: 600;"></span>
            </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; align-items: center;">
            <span>Giảm giá</span>
            <input type="number" id="pos-pay-discount" value="0" min="0" oninput="calcPosTotal()" style="width: 100px; text-align: right; border:none; border-bottom: 1px solid var(--border-color); outline:none;">
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: 700; font-size: 15px;">
            <span>Khách cần trả</span>
            <span id="pos-pay-final" style="color: var(--danger);">0</span>
        </div>
    </div>
    
    <div style="padding: 15px 20px; border-top: 1px solid var(--border-color);">
        <button class="btn-pay" onclick="submitPosPayment()">THANH TOÁN</button>
    </div>
  </div>
</div>
`;
    html = html.replace('<!-- ================= CÁC MODAL ================= -->', posModals + '\n  <!-- ================= CÁC MODAL ================= -->');


    const posScript = `
/* ---------------- POS LOGIC ---------------- */
let posCart = [];
let posSelectedCustomer = null; 
let posViewMode = 'grid'; 
let posSearchTerm = '';
let posSelectedCategories = [];

function initPos() {
    posSelectedCategories = [];
    renderPosProducts();
    updatePosCartUI();
    posSelectedCustomer = null; 
    document.getElementById('pos-customer-search').value = '';
}

function renderPosProducts() {
    const listEl = document.getElementById('pos-products-list');
    listEl.innerHTML = '';
    
    let items = appData.KHO;
    if (posSelectedCategories.length > 0) {
        items = items.filter(p => posSelectedCategories.includes(p.NhomHang));
    }
    
    items.forEach(p => {
        const itemEl = document.createElement('div');
        itemEl.className = 'pos-product-item';
        const imgUrl = p.HinhAnh && p.HinhAnh.startsWith('data:') ? p.HinhAnh : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="%23ddd"/><text x="15" y="35" fill="%23555" font-family="sans-serif" font-size="12">IMG</text></svg>';
        
        itemEl.innerHTML = \`
            <img src="\${imgUrl}" class="pos-product-img">
            <div style="display: flex; flex-direction: column; flex: 1;">
                <div class="pos-product-name" title="\${p.TenSP}">\${p.TenSP}</div>
                <div class="pos-product-price" style="margin-top:auto;">\${formatVN(p.GiaBan)}</div>
            </div>
        \`;
        itemEl.onclick = () => addPosProduct(p);
        listEl.appendChild(itemEl);
    });
}

function addPosProduct(p) {
    let existing = posCart.find(x => x.MaSP === p.MaSP);
    if(existing) {
        existing.qty += 1;
    } else {
        posCart.push({ ...p, qty: 1 });
    }
    updatePosCartUI();
}

function updatePosCartQty(index, qty) {
    let q = parseInt(qty);
    if(isNaN(q) || q < 1) q = 1;
    posCart[index].qty = q;
    updatePosCartUI();
}

function removePosCartItem(index) {
    posCart.splice(index, 1);
    updatePosCartUI();
}

function updatePosCartUI() {
    const listEl = document.getElementById('pos-cart-list');
    listEl.innerHTML = '';
    
    let totalQty = 0;
    let totalPrice = 0;
    
    posCart.forEach((item, index) => {
        totalQty += item.qty;
        totalPrice += item.GiaBan * item.qty;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'pos-cart-item';
        itemEl.innerHTML = \`
            <div class="pos-cart-index">\${index + 1}</div>
            <div class="pos-cart-del" onclick="removePosCartItem(\${index})">🗑️</div>
            <div class="pos-cart-details">
                <div class="pos-cart-top">\${item.MaSP} &nbsp;&nbsp; \${item.TenSP}</div>
                <div class="pos-cart-controls">
                    <input type="number" class="pos-qty-input" value="\${item.qty}" min="1" onchange="updatePosCartQty(\${index}, this.value)">
                    <div class="pos-cart-price">\${formatVN(item.GiaBan * item.qty)}</div>
                </div>
            </div>
        \`;
        listEl.appendChild(itemEl);
    });
    
    document.getElementById('pos-total-items').innerText = totalQty;
    document.getElementById('pos-total-price').innerText = formatVN(totalPrice);
}

function togglePosViewMode() {
    const btn = document.getElementById('pos-view-toggle');
    const listEl = document.getElementById('pos-products-list');
    
    if(posViewMode === 'grid') {
        posViewMode = 'list';
        btn.innerText = '🔲'; // Icon for Grid
        listEl.classList.remove('grid-view');
        listEl.classList.add('list-view');
    } else {
        posViewMode = 'grid';
        btn.innerText = '🖼️'; // Icon for List
        listEl.classList.remove('list-view');
        listEl.classList.add('grid-view');
    }
}

function posSearchCustomer() {
    const term = document.getElementById('pos-customer-search').value.toLowerCase().trim();
    const suggestList = document.getElementById('pos-customer-suggest');
    if(!term) {
        suggestList.style.display = 'none';
        posSelectedCustomer = null; 
        return;
    }
    
    let list = appData.KHACHHANG.filter(kh => (kh.SDT || '').toLowerCase().includes(term) || (kh.TenKH || '').toLowerCase().includes(term));
    
    suggestList.innerHTML = '';
    if(list.length > 0) {
        list.forEach(item => {
            const el = document.createElement('div');
            el.className = 'autocomplete-item';
            el.innerHTML = '<strong>' + item.TenKH + '</strong> - ' + (item.SDT || 'N/A') + ' <br><small style="color:#888">' + (item.LoaiKH || '') + '</small>';
            el.onmousedown = function() { 
                document.getElementById('pos-customer-search').value = item.TenKH + ' - ' + item.SDT;
                posSelectedCustomer = item;
                suggestList.style.display = 'none';
            };
            suggestList.appendChild(el);
        });
        suggestList.style.display = 'block';
    } else {
        suggestList.style.display = 'none';
        posSelectedCustomer = null;
    }
}
document.getElementById('pos-customer-search').addEventListener('blur', () => { setTimeout(() => { document.getElementById('pos-customer-suggest').style.display='none'; }, 200); });

function openPosFilterModal() {
    document.getElementById('pos-filter-modal').classList.add('show');
    const container = document.getElementById('pos-filter-categories');
    
    let catSet = new Set();
    appData.KHO.forEach(p => { if(p.NhomHang) catSet.add(p.NhomHang); });
    let cats = Array.from(catSet).sort();
    
    container.innerHTML = '';
    cats.forEach(c => {
        const checked = posSelectedCategories.includes(c) ? 'checked' : '';
        const id = 'pos-cat-' + c.replace(/\\s/g, '-');
        container.innerHTML += \`
            <label style="display:flex; gap:10px; align-items:center; cursor:pointer; padding:8px 0; border-bottom: 1px solid #eee;">
                <input type="checkbox" class="pos-cat-check" value="\${c}" \${checked}> 
                \${c}
            </label>
        \`;
    });
}
function closePosFilterModal() { document.getElementById('pos-filter-modal').classList.remove('show'); }
function applyPosFilter() {
    posSelectedCategories = Array.from(document.querySelectorAll('.pos-cat-check:checked')).map(el => el.value);
    renderPosProducts();
    closePosFilterModal();
}
function resetPosFilter() {
    posSelectedCategories = [];
    renderPosProducts();
    closePosFilterModal();
}

function openPosPaymentModal() {
    if(posCart.length === 0) return showToast('Chưa có sản phẩm nào để thanh toán!', true);
    
    const qty = posCart.reduce((acc, item) => acc + item.qty, 0);
    const sum = posCart.reduce((acc, item) => acc + (item.GiaBan * item.qty), 0);
    
    const staffSelect = document.getElementById('pos-pay-staff');
    staffSelect.innerHTML = '';
    appData.NHANSU.map(n => \`<option value="\${n.MaNV}">\${n.TenNV} - \${n.MaNV}</option>\`).forEach(opt => staffSelect.innerHTML += opt);
    if(currentUser) staffSelect.value = currentUser.MaNV;
    
    const d = new Date();
    document.getElementById('pos-pay-date').innerText = d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'});
    
    if (posSelectedCustomer) {
        document.getElementById('pos-pay-customer-name').innerHTML = \`\${posSelectedCustomer.TenKH} <span style="font-size:13px; font-weight:normal; color:#888;">(\${posSelectedCustomer.LoaiKH || 'Chưa phân loại'})</span>\`;
    } else {
        document.getElementById('pos-pay-customer-name').innerText = 'Khách lẻ';
    }
    
    document.getElementById('pos-pay-total-qty').innerText = qty;
    document.getElementById('pos-pay-total-price').innerText = formatVN(sum);
    document.getElementById('pos-pay-discount').value = 0;
    
    calcPosTotal();
    document.getElementById('pos-payment-modal').classList.add('show');
}

function closePosPaymentModal() { document.getElementById('pos-payment-modal').classList.remove('show'); }

function calcPosTotal() {
    const sum = posCart.reduce((acc, item) => acc + (item.GiaBan * item.qty), 0);
    let disc = parseInt(document.getElementById('pos-pay-discount').value) || 0;
    let final = sum - disc;
    if (final < 0) final = 0;
    document.getElementById('pos-pay-final').innerText = formatVN(final);
}

function submitPosPayment() {
    const sum = posCart.reduce((acc, item) => acc + (item.GiaBan * item.qty), 0);
    let disc = parseInt(document.getElementById('pos-pay-discount').value) || 0;
    let final = sum - disc;
    if (final < 0) final = 0;
    
    const staffId = document.getElementById('pos-pay-staff').value;
    const staffObj = appData.NHANSU.find(n => n.MaNV === staffId);
    
    const maKH = posSelectedCustomer ? posSelectedCustomer.MaKH : 'KL';
    
    let maxId = 0;
    appData.DONHANG.forEach(dh => {
        let num = parseInt(dh.MaDH.replace('DH', ''));
        if (!isNaN(num) && num > maxId) maxId = num;
    });
    let newMaDH = 'DH' + String(maxId + 1).padStart(6, '0');
    
    posCart.forEach(item => {
        let product = appData.KHO.find(p => p.MaSP === item.MaSP);
        if (product && product.TonKho >= item.qty) {
            product.TonKho -= item.qty;
        }
    });

    appData.DONHANG.unshift({
        MaDH: newMaDH,
        NgayTao: new Date().toISOString(),
        MaKH: maKH,
        KhachHang: posSelectedCustomer ? posSelectedCustomer.TenKH : 'Khách lẻ',
        TongTien: sum,
        DaTra: final,
        NhanVien: staffObj ? staffObj.TenNV : currentUser?.TenNV,
        TrangThai: 'Hoàn thành'
    });
    
    if (posSelectedCustomer) {
        let kh = appData.KHACHHANG.find(x => x.MaKH === maKH);
        if (kh) {
            kh.TongMua = (kh.TongMua || 0) + sum;
        }
    }
    
    localStorage.setItem('adminAppData', JSON.stringify(appData));
    
    closePosPaymentModal();
    showToast('Đơn hàng ' + newMaDH + ' đã được thanh toán!');
    
    posCart = [];
    document.getElementById('pos-customer-search').value = '';
    posSelectedCustomer = null;
    initPos(); 
    
    calcAndDrawCharts();
    renderTables();
}

    function initSystem() {`;
    
    html = html.replace('function initSystem() {', posScript + '\n        initPos();\n');
}

fs.writeFileSync('index.html', html);
console.log('Update OK');
