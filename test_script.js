
    /* 1. MOCK DATA && INITIALIZATION */
let posCart = [];
let posSelectedCustomer = null; 
let posViewMode = 'grid'; 
let posSearchTerm = '';
let posSelectedCategories = [];

    const DEFAULT_DATA = {
      TAIKHOAN: [
        { username: 'admin', password: '123', Quyen: 'Admin', MaNV: 'AD01', TenNV: 'Trần Admin', TrangThai: 'Hoạt động' },
        { username: 'NV01', password: '123', Quyen: 'Sales', MaNV: 'NV01', TenNV: 'Nguyễn Sales', TrangThai: 'Hoạt động' },
        { username: 'NV02', password: '123', Quyen: 'Sales', MaNV: 'NV02', TenNV: 'Lê Hỗ Trợ', TrangThai: 'Hoạt động' }
      ],
      KHACHHANG: [
        { MaKH: 'KH001', TenKH: 'Công ty Cổ phần Alpha', SDT: '0988111222', DiaChi: 'Hà Nội', LoaiKH: 'Doanh nghiệp VIP' },
        { MaKH: 'KH002', TenKH: 'Lê Nguyễn Hoàng Hải', SDT: '0912333444', DiaChi: 'TP.HCM', LoaiKH: 'Cá nhân Platinum' },
        { MaKH: 'KH003', TenKH: 'Trần B', SDT: '0909555666', DiaChi: 'Đà Nẵng', LoaiKH: 'Cá nhân' }
      ],
      SANPHAM: [
        { MaSP: 'SP01', TenSP: 'Laptop Dell XPS 15', TenLoaiSP: 'Laptop', DonGia: 35000000, TonKho: 120 },
        { MaSP: 'SP02', TenSP: 'iPhone 15 Pro Max', TenLoaiSP: 'Điện thoại', DonGia: 29000000, TonKho: 15 },
        { MaSP: 'SP03', TenSP: 'Màn hình Dell U27', TenLoaiSP: 'Phụ kiện', DonGia: 12000000, TonKho: 45 },
        { MaSP: 'SP04', TenSP: 'Bàn phím cơ Keychron', TenLoaiSP: 'Phụ kiện', DonGia: 3000000, TonKho: 8 },
        { MaSP: 'SP05', TenSP: 'Tai nghe Sony WH-1000XM5', TenLoaiSP: 'Phụ kiện', DonGia: 6500000, TonKho: 50 }
      ],
      DONHANG: [
        { MaDH: 'DH2024_01', Ngay: '2024-04-10', MaKH: 'KH001', TrangThai: 'Đã thanh toán', TongTien: 35000000, MaNV: 'NV01' },
        { MaDH: 'DH2024_02', Ngay: '2024-04-12', MaKH: 'KH002', TrangThai: 'Chưa thanh toán', TongTien: 12500000, MaNV: 'NV01' },
        { MaDH: 'DH2024_03', Ngay: '2024-05-02', MaKH: 'KH003', TrangThai: 'Trả góp', TongTien: 6500000, MaNV: 'AD01' },
        { MaDH: 'DH2024_04', Ngay: '2024-05-15', MaKH: 'KH001', TrangThai: 'Đã thanh toán', TongTien: 42000000, MaNV: 'NV01' },
        { MaDH: 'DH2024_05', Ngay: '2024-05-20', MaKH: 'KH002', TrangThai: 'Đã thanh toán', TongTien: 29000000, MaNV: 'NV02' }
      ],
      CTDH: [
        { MaDH: 'DH2024_01', MaSP: 'SP01', SoLuong: 1, DonGia: 35000000, TongTien: 35000000, GiamGia: 0 },
        { MaDH: 'DH2024_02', MaSP: 'SP05', SoLuong: 2, DonGia: 6500000, TongTien: 12500000, GiamGia: 0.038 },
        { MaDH: 'DH2024_03', MaSP: 'SP05', SoLuong: 1, DonGia: 6500000, TongTien: 6500000, GiamGia: 0 },
        { MaDH: 'DH2024_04', MaSP: 'SP01', SoLuong: 1, DonGia: 35000000, TongTien: 35000000, GiamGia: 0 },
        { MaDH: 'DH2024_04', MaSP: 'SP03', SoLuong: 1, DonGia: 12000000, TongTien: 7000000, GiamGia: 0.416 },
        { MaDH: 'DH2024_05', MaSP: 'SP02', SoLuong: 1, DonGia: 29000000, TongTien: 29000000, GiamGia: 0 }
      ]
    };

    
    let crmSortCol = null;
    let crmSortDir = 0; // 0=none, 1=asc, 2=desc
    let crmLimit = 10;
    let crmSelected = new Set();
    let crmExpanded = new Set();

    let appData = JSON.parse(localStorage.getItem('adminAppData'));
    if (!appData || !appData.KHACHHANG) {
      appData = DEFAULT_DATA;
      localStorage.setItem('adminAppData', JSON.stringify(appData));
    }

    const fm = (val) => new Intl.NumberFormat('vi-VN').format(val);

    // Toast UI
    function showToast(msg, isError = false) {
      let t = document.getElementById('toast-msg');
      if(!t) {
        t = document.createElement('div'); t.id = 'toast-msg';
        t.style = 'position:fixed; bottom:20px; right:20px; padding:15px 25px; border-radius:4px; z-index:99999; font-weight:600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.15); pointer-events: none; transform: translateY(20px); opacity: 0;';
        document.body.appendChild(t);
      }
      
      if (isError) {
          t.style.backgroundColor = '#fce8e6';
          t.style.color = '#c5221f';
          t.style.borderLeft = '4px solid #c5221f';
      } else {
          t.style.backgroundColor = '#e6f4ea';
          t.style.color = '#137333';
          t.style.borderLeft = '4px solid #137333';
      }
      
      t.innerText = msg;
      
      // Force reflow to ensure the enter animation plays
      void t.offsetWidth;
      
      t.style.pointerEvents = 'auto';
      t.style.transform = 'translateY(0)'; t.style.opacity = '1';
      
      if (t._timeout) clearTimeout(t._timeout);
      t._timeout = setTimeout(() => { 
          t.style.transform = 'translateY(20px)'; 
          t.style.opacity = '0'; 
          t.style.pointerEvents = 'none';
      }, 3000);
    }

    // Confirm UI
    let confirmCallback = null;
    function showConfirm(msg, callback) {
      document.getElementById('confirm-modal-message').innerText = msg;
      confirmCallback = callback;
      document.getElementById('confirm-modal').classList.add('show');
    }
    function closeConfirmModal() {
      document.getElementById('confirm-modal').classList.remove('show');
      confirmCallback = null;
    }
    document.getElementById('btn-confirm-action').addEventListener('click', () => {
      if(confirmCallback) confirmCallback();
      closeConfirmModal();
    });

    /* 2. AUTHENTICATION & RBAC */
    let currentUser = null;

    /* 3. CHARTS & DATA RENDERING */
    let cMonthChart, cRegionChart, cCityChart, cHieuSuatChart;
    if (typeof Chart !== "undefined") { Chart.defaults.maintainAspectRatio = false; Chart.defaults.responsive = true; }
    const regionColors = ['#a361ec', '#ff5e78', '#34d896', '#ffb822', '#5190f8', '#ff8b9d', '#b062ff'];

    
    // Patch DONHANG dates to be recent relative to current time so charts show data
    if (appData.DONHANG) {
        const now = new Date();
        const baseD = new Date(now);
        appData.DONHANG.forEach((dh, idx) => {
           let rD = new Date(now);
           if (idx === 0) rD.setDate(now.getDate()); // today
           else if (idx === 1) rD.setDate(now.getDate() - 1); // yesterday
           else if (idx === 2) rD.setDate(now.getDate() - 3); // 3 days ago
           else if (idx === 3) rD.setDate(now.getDate() - 6); // 6 days ago
           else if (idx === 4) rD.setMonth(now.getMonth() - 1); // last month
           dh.Ngay = rD.toISOString().split('T')[0] + " 10:30"; // add arbitrary hour
        });
    }

    let sess = sessionStorage.getItem('adminLogged');
    if (sess) {
      currentUser = JSON.parse(sess);
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('app-container').style.display = 'flex';
      initSystem();
    }

    function login() {
      const u = document.getElementById('login-username').value;
      const p = document.getElementById('login-password').value;
      const acc = appData.TAIKHOAN.find(tk => tk.username === u && tk.password === p && (tk.TrangThai !== 'Đã Thu Hồi'));

      if (acc) {
        currentUser = { username: acc.username, Quyen: acc.Quyen, MaNV: acc.MaNV, TenNV: acc.TenNV };
        sessionStorage.setItem('adminLogged', JSON.stringify(currentUser));
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        initSystem();
      } else {
        showToast("Sai tên đăng nhập hoặc mật khẩu!", true);
      }
    }

    function logout() {
      showConfirm('Bạn có chắc chắn muốn đăng xuất?', () => {
        sessionStorage.removeItem('adminLogged');
        window.location.reload();
      });
    }

    function applyRBAC() {
      const isSales = currentUser.Quyen === 'Sales';
      document.getElementById('user-name-text').innerText = currentUser.username;
      document.getElementById('user-role-text').innerText = currentUser.Quyen !== 'Admin' ? 'Sales' : 'Admin';
      document.getElementById('user-avatar').src = `https://ui-avatars.com/api/?name=${currentUser.username}&background=f1f1f5`;

      const staffTab = document.getElementById('nav-staff');
      const btnAddProduct = document.getElementById('btn-add-product');
      const adminStaffFilter = document.getElementById('filter-order-manv-container');
      const thInvAction = document.getElementById('th-inv-action');
      
      if (isSales) {
        staffTab.style.display = 'none';
        btnAddProduct.style.display = 'none';
        if (adminStaffFilter) adminStaffFilter.style.display = 'none';
        if (thInvAction) thInvAction.style.display = 'none';
      } else {
        staffTab.style.display = 'flex';
        btnAddProduct.style.display = 'inline-flex';
        if (adminStaffFilter) adminStaffFilter.style.display = 'flex';
        if (thInvAction) thInvAction.style.display = 'table-cell';
      }
    }

    // ROLE FILTER
    function getFilteredOrders() {
      if (currentUser.Quyen === 'Sales') {
        return appData.DONHANG.filter(dh => dh.MaNV === currentUser.MaNV);
      }
      return appData.DONHANG; // Admin views all
    }

    function getRegionByCity(city) {
      if (['Hà Nội', 'Hải Phòng', 'Quảng Ninh', 'Hưng Yên'].includes(city)) return 'Đồng Bằng Sông Hồng';
      if (['TP.HCM', 'Đồng Nai', 'Bình Dương'].includes(city)) return 'Đông Nam Bộ';
      if (['Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi'].includes(city)) return 'Nam Trung Bộ';
      if (['Cần Thơ', 'Đồng Tháp', 'An Giang', 'Kiên Giang'].includes(city)) return 'ĐBS Cửu Long';
      return 'Khu vực KHÁC';
    }


    /* 3. CHARTS & DATA RENDERING */
    
/* ---------------- POS LOGIC ---------------- */

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
        
        itemEl.innerHTML = `
            <img src="${imgUrl}" class="pos-product-img">
            <div style="display: flex; flex-direction: column; flex: 1;">
                <div class="pos-product-name" title="${p.TenSP}">${p.TenSP}</div>
                <div class="pos-product-price" style="margin-top:auto;">${fm(p.GiaBan)}</div>
            </div>
        `;
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
        itemEl.innerHTML = `
            <div class="pos-cart-index">${index + 1}</div>
            <div class="pos-cart-del" onclick="removePosCartItem(${index})">🗑️</div>
            <div class="pos-cart-details">
                <div class="pos-cart-top">${item.MaSP} &nbsp;&nbsp; ${item.TenSP}</div>
                <div class="pos-cart-controls">
                    <input type="number" class="pos-qty-input" value="${item.qty}" min="1" onchange="updatePosCartQty(${index}, this.value)">
                    <div class="pos-cart-price">${fm(item.GiaBan * item.qty)}</div>
                </div>
            </div>
        `;
        listEl.appendChild(itemEl);
    });
    
    document.getElementById('pos-total-items').innerText = totalQty;
    document.getElementById('pos-total-price').innerText = fm(totalPrice);
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
        const id = 'pos-cat-' + c.replace(/\s/g, '-');
        container.innerHTML += `
            <label style="display:flex; gap:10px; align-items:center; cursor:pointer; padding:8px 0; border-bottom: 1px solid #eee;">
                <input type="checkbox" class="pos-cat-check" value="${c}" ${checked}> 
                ${c}
            </label>
        `;
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
    appData.NHANSU.map(n => `<option value="${n.MaNV}">${n.TenNV} - ${n.MaNV}</option>`).forEach(opt => staffSelect.innerHTML += opt);
    if(currentUser) staffSelect.value = currentUser.MaNV;
    
    const d = new Date();
    document.getElementById('pos-pay-date').innerText = d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'});
    
    if (posSelectedCustomer) {
        document.getElementById('pos-pay-customer-name').innerHTML = `${posSelectedCustomer.TenKH} <span style="font-size:13px; font-weight:normal; color:#888;">(${posSelectedCustomer.LoaiKH || 'Chưa phân loại'})</span>`;
    } else {
        document.getElementById('pos-pay-customer-name').innerText = 'Khách lẻ';
    }
    
    document.getElementById('pos-pay-total-qty').innerText = qty;
    document.getElementById('pos-pay-total-price').innerText = fm(sum);
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
    document.getElementById('pos-pay-final').innerText = fm(final);
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

    function initSystem() {
        initPos();

      applyRBAC();
      buildFormSelects();
      calcAndDrawCharts();
      renderTables();
      calcNotifications();
    }

    
    function updateTimeChart() {
       let orders = getFilteredOrders();
       const val = document.getElementById('chart-time-select').value;
       let ml = [];
       let md = [];
       let map = {};
       
       const now = new Date();
       if (val === 'today' || val === 'yesterday') {
           // 0-23 hours
           for(let i=0; i<=23; i++) {
               let lbl = i + 'h';
               map[lbl] = 0;
               ml.push(lbl);
           }
           let targetDateStr = '';
           if (val === 'today') {
               targetDateStr = now.toISOString().split('T')[0];
           } else {
               let y = new Date(now);
               y.setDate(y.getDate() - 1);
               targetDateStr = y.toISOString().split('T')[0];
           }
           orders.forEach(dh => {
               if (dh.Ngay.startsWith(targetDateStr)) {
                   let hour = 0;
                   if (dh.Ngay.includes(' ')) {
                       hour = parseInt(dh.Ngay.split(' ')[1].split(':')[0], 10);
                   }
                   if (!isNaN(hour)) {
                      map[hour + 'h'] += dh.TongTien;
                   }
               }
           });
       } else if (val === '7days') {
           // T2-CN (Viết tắt)
           const daysStr = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
           // Get past 7 days
           for(let i=6; i>=0; i--) {
               let d = new Date(now);
               d.setDate(d.getDate() - i);
               let lbl = daysStr[d.getDay()];
               map[lbl] = 0;
               ml.push(lbl);
           }
           const pastDate = new Date(now);
           pastDate.setDate(pastDate.getDate() - 7);
           orders.forEach(dh => {
               let dhD = new Date(dh.Ngay);
               if (dhD >= pastDate && dhD <= now) {
                   let lbl = daysStr[dhD.getDay()];
                   if (map[lbl] !== undefined) {
                       map[lbl] += dh.TongTien;
                   }
               }
           });
       } else if (val === 'thisMonth' || val === 'lastMonth') {
           let targetMonth = now.getMonth();
           let targetYear = now.getFullYear();
           if (val === 'lastMonth') {
               targetMonth -= 1;
               if(targetMonth < 0) { targetMonth = 11; targetYear -= 1; }
           }
           let daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
           for(let i=1; i<=daysInMonth; i++) {
               map[i] = 0;
               ml.push(i);
           }
           orders.forEach(dh => {
               let d = new Date(dh.Ngay);
               if(d.getMonth() === targetMonth && d.getFullYear() === targetYear) {
                   let day = d.getDate();
                   map[day] += dh.TongTien;
               }
           });
       }
       
       md = ml.map(k => map[k]);
       
       if (cMonthChart) {
           cMonthChart.data.labels = ml;
           cMonthChart.data.datasets[0].data = md;
           cMonthChart.update();
       } else {
           window._initML = ml;
           window._initMD = md;
       }
    }

    function calcAndDrawCharts() {
      let orders = getFilteredOrders();
      let regionMap = {}, cityMap = {}, statusMap = {}, staffMap = {};
      let totalRev = 0;

      orders.forEach(dh => {
        // Month calc
        
        
        
        // Region & City calc
        let kh = appData.KHACHHANG.find(k => k.MaKH === dh.MaKH);
        let city = kh ? kh.DiaChi : 'Khác';
        let region = getRegionByCity(city);
        regionMap[region] = (regionMap[region] || 0) + dh.TongTien;
        cityMap[city] = (cityMap[city] || 0) + dh.TongTien;
        // Status & Staff
        statusMap[dh.TrangThai] = (statusMap[dh.TrangThai] || 0) + 1;
        staffMap[dh.MaNV] = (staffMap[dh.MaNV] || 0) + dh.TongTien;
        
        if (dh.TrangThai === 'Đã thanh toán') totalRev += dh.TongTien;
      });
      
      const elRev = document.getElementById('stat-revenue');
      if(elRev) elRev.innerText = fm(totalRev);
      const elProj = document.getElementById('stat-projects');
      if(elProj) elProj.innerText = orders.length;
      const elCust = document.getElementById('stat-time');
      if(elCust) elCust.innerText = appData.KHACHHANG.length;

      updateTimeChart(); let ml = window._initML || []; let md = window._initMD || [];
      let rl = Object.keys(regionMap);       let rd = rl.map(k=>regionMap[k]);
      let stl = Object.keys(statusMap);      let std = stl.map(k=>statusMap[k]);
      let cL = Object.keys(cityMap).sort((a,b)=>cityMap[b] - cityMap[a]); let cD = cL.map(k=>cityMap[k]);
      let sL = Object.keys(staffMap);        let sD = sL.map(k=>staffMap[k]);

      // Initialize or update
      const pieOptions = {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let dataset = context.dataset;
                let total = dataset.data.reduce((acc, val) => acc + val, 0);
                let value = dataset.data[context.dataIndex];
                let percentage = ((value / total) * 100).toFixed(1) + '%';
                return `${context.label}: ${percentage} (${value} đơn)`;
              }
            }
          }
        }
      };

      const pieDoanhThuOptions = {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let dataset = context.dataset;
                let total = dataset.data.reduce((acc, val) => acc + val, 0);
                let value = dataset.data[context.dataIndex];
                let percentage = ((value / total) * 100).toFixed(1) + '%';
                return `${context.label}: ${percentage} (${fm(value)} đ)`;
              }
            }
          }
        }
      };

      if (!cMonthChart) {
        cMonthChart = new Chart(document.getElementById('chart-doanhthu-thang'), { type: 'line', data: { labels: ml, datasets: [{ label: 'Doanh Thu (VNĐ)', data: md, borderColor: '#a361ec', backgroundColor: 'rgba(163, 97, 236, 0.2)', fill: true, tension: 0.3 }] } });
        cRegionChart = new Chart(document.getElementById('chart-doanhthu-vung'), { type: 'pie', data: { labels: rl, datasets: [{ data: rd, backgroundColor: regionColors }] }, options: pieDoanhThuOptions });
        cCityChart = new Chart(document.getElementById('chart-doanhthu-tp'), { type: 'bar', data: { labels: cL, datasets: [{ label: 'Quy mô giao dịch (VNĐ)', data: cD, backgroundColor: '#ff5e78' }] }, options: { indexAxis: 'y' } });
        
        cHieuSuatChart = new Chart(document.getElementById('chart-hieu-suat'), { type: 'bar', data: { labels: sL, datasets: [{ label: 'Sale (VNĐ)', data: sD, backgroundColor: '#34d896' }] } });
      } else {
        cMonthChart.data.labels = ml; cMonthChart.data.datasets[0].data = md; cMonthChart.update();
        cRegionChart.data.labels = rl; cRegionChart.data.datasets[0].data = rd; cRegionChart.update();
        cCityChart.data.labels = cL; cCityChart.data.datasets[0].data = cD; cCityChart.update();
        
        cHieuSuatChart.data.labels = sL; cHieuSuatChart.data.datasets[0].data = sD; cHieuSuatChart.update();
      }
    }

    function clearFilters(type) {
        if(type === 'crm') {
            document.getElementById('filter-crm-search').value = '';
            document.getElementById('filter-crm-address').value = '';
            document.getElementById('filter-crm-type').value = '';
            crmSortCol=null; crmSortDir=0; crmSelected.clear(); resetCrmSortIcons(); document.getElementById('crm-select-all').checked = false;
        } else if(type === 'order') {
            document.getElementById('filter-order-makh').value = '';
            document.getElementById('filter-order-datefrom').value = '';
            document.getElementById('filter-order-dateto').value = '';
            document.getElementById('filter-order-pmin').value = '';
            document.getElementById('filter-order-pmax').value = '';
            
            const manvInput = document.getElementById('filter-order-manv');
            if(manvInput) manvInput.value = '';
            
            document.getElementById('sort-order').value = '';
        } else if(type === 'inv') {
            document.getElementById('filter-inv-search').value = '';
            document.getElementById('filter-inv-type').value = '';
            document.getElementById('filter-inv-stockmin').value = '';
            document.getElementById('filter-inv-stockmax').value = '';
            document.getElementById('filter-inv-warning').value = '';
            document.getElementById('sort-inv').value = '';
        }
        renderTables();
    }

    function renderTables() {
      let orders = getFilteredOrders();
      let orderIds = orders.map(o => o.MaDH);
      const isSales = currentUser.Quyen === 'Sales';

      
      // Update Employee performance table in Dashboard
   
      
      // Update Employee performance table in Dashboard
      let hieuSuatMap_db = {};
      appData.DONHANG.forEach(dh => {
            if(!hieuSuatMap_db[dh.MaNV]) hieuSuatMap_db[dh.MaNV] = { soDon: 0, sale: 0 };
            hieuSuatMap_db[dh.MaNV].soDon += 1;
            hieuSuatMap_db[dh.MaNV].sale += dh.TongTien;
      });

      let dashNhanVienHtml = '';
      appData.TAIKHOAN.forEach(tk => {
         let sale = hieuSuatMap_db[tk.MaNV]?.sale || 0;
         let soDon = hieuSuatMap_db[tk.MaNV]?.soDon || 0;
         if (tk.username !== 'admin') {
             dashNhanVienHtml += `<tr>
                <td>${tk.MaNV}</td>
                <td>${tk.TenNV}</td>
                <td>${soDon}</td>
                <td><b>${fm(sale)} đ</b></td>
             </tr>`;
         }
      });
      const dashNvTbody = document.getElementById('tbody-dashboard-nhanvien');
      if (dashNvTbody) {
          dashNvTbody.innerHTML = dashNhanVienHtml;
      }

      // Update Recent Activities
      const actContainer = document.getElementById('recent-activities');
      if (actContainer) {
          let actHtml = '';
          const recentOrders = [...appData.DONHANG].sort((a,b) => new Date(b.Ngay) - new Date(a.Ngay)).slice(0, 10);
          recentOrders.forEach(order => {
              const nv = appData.TAIKHOAN.find(t => t.MaNV === order.MaNV);
              const tenNv = nv ? nv.TenNV : 'Admin';
              
              // format date with time
              let oDateStr = order.Ngay.replace(' ', 'T'); // make it valid ISO if it has space
              let oDate = new Date(oDateStr);
              let _d = String(oDate.getDate()).padStart(2, '0');
              let _m = String(oDate.getMonth()+1).padStart(2, '0');
              let _y = oDate.getFullYear();
              let _hr = String(oDate.getHours()).padStart(2, '0');
              let _min = String(oDate.getMinutes()).padStart(2, '0');
              
              let hasTime = order.Ngay.includes(':');
              let fmtDate = hasTime ? `${_hr}:${_min}, ${_d}-${_m}-${_y}` : `${_d}-${_m}-${_y}`;

              actHtml += `<div style="display: flex; align-items: flex-start; gap: 12px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color);">
                  <div style="width: 32px; height: 32px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 14px;">🛍️</div>
                  <div>
                      <div style="font-size: 13px; color: var(--text-main);"><strong>${tenNv}</strong> đã bán đơn <strong>${order.MaDH}</strong> trị giá <strong>${fm(order.TongTien)} đ</strong></div>
                      <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${fmtDate}</div>
                  </div>
              </div>`;
          });
          actContainer.innerHTML = actHtml;
      }

      // 1. TOP SẢN PHẨM BÁN CHẠY (Thực tế + Filter ROLE)
      let spStats = appData.SANPHAM.map(sp => ({ ...sp, DaBan: 0, DoanhThu: 0 }));
      if(appData.CTDH) {
         appData.CTDH.forEach(ct => {
            if(orderIds.includes(ct.MaDH)) {
               let st = spStats.find(x => x.MaSP === ct.MaSP);
               if(st) { st.DaBan += ct.SoLuong; st.DoanhThu += ct.TongTien; }
            }
         });
      }
      let topSpHtml = '';
      spStats.sort((a,b) => b.DoanhThu - a.DoanhThu).slice(0,10).forEach(sp => {
         topSpHtml += `<tr><td>${sp.MaSP}</td><td><b>${sp.TenSP}</b></td>
         <td>${sp.TenLoaiSP}</td><td>${fm(sp.DaBan)}</td><td>${fm(sp.DoanhThu)} đ</td></tr>`;
      });
      document.querySelector('#tbl-top-sp tbody').innerHTML = topSpHtml;

      // 2. KHÁCH HÀNG VIP
      let khStats = appData.KHACHHANG.map(kh => ({ ...kh, SoDon: 0, TongTien: 0 }));
      orders.forEach(dh => {
         let st = khStats.find(x => x.MaKH === dh.MaKH);
         if(st) { st.SoDon += 1; st.TongTien += dh.TongTien; }
      });
      let vipHtml = '';
      khStats.sort((a,b) => b.TongTien - a.TongTien).slice(0,10).forEach(k => {
         if(k.SoDon > 0) {
            vipHtml += `<tr><td><span class="badge badge-dark">${k.MaKH}</span></td>
            <td><b>${k.TenKH}</b></td><td>${k.LoaiKH}</td>
            <td>${k.SoDon}</td><td>${fm(k.TongTien)} đ</td></tr>`;
         }
      });
      document.querySelector('#tbl-khach-vip tbody').innerHTML = vipHtml;

      // 3. ĐƠN HÀNG HỆ THỐNG
      let uiFilteredOrders = [...orders];

      // Filters
      let fMakh = document.getElementById('filter-order-makh')?.value.toLowerCase();
      if(fMakh) uiFilteredOrders = uiFilteredOrders.filter(dh => dh.MaKH.toLowerCase().includes(fMakh));
      
      let fDFrom = document.getElementById('filter-order-datefrom')?.value;
      if(fDFrom) uiFilteredOrders = uiFilteredOrders.filter(dh => new Date(dh.Ngay) >= new Date(fDFrom));
      
      let fDTo = document.getElementById('filter-order-dateto')?.value;
      if(fDTo) uiFilteredOrders = uiFilteredOrders.filter(dh => new Date(dh.Ngay) <= new Date(fDTo));
      
      let fPMin = document.getElementById('filter-order-pmin')?.value;
      if(fPMin !== "" && !isNaN(fPMin)) uiFilteredOrders = uiFilteredOrders.filter(dh => dh.TongTien >= parseFloat(fPMin));
      
      let fPMax = document.getElementById('filter-order-pmax')?.value;
      if(fPMax !== "" && !isNaN(fPMax)) uiFilteredOrders = uiFilteredOrders.filter(dh => dh.TongTien <= parseFloat(fPMax));
      
      let fManv = document.getElementById('filter-order-manv')?.value.toLowerCase();
      if(!isSales && fManv) {
          uiFilteredOrders = uiFilteredOrders.filter(dh => dh.MaNV.toLowerCase().includes(fManv));
      }

      // Sort
      let sOrd = document.getElementById('sort-order')?.value;
      if(sOrd === 'Ngay_desc') uiFilteredOrders.sort((a,b) => new Date(b.Ngay) - new Date(a.Ngay));
      else if(sOrd === 'Ngay_asc') uiFilteredOrders.sort((a,b) => new Date(a.Ngay) - new Date(b.Ngay));
      else if(sOrd === 'Tien_desc') uiFilteredOrders.sort((a,b) => b.TongTien - a.TongTien);
      else if(sOrd === 'Tien_asc') uiFilteredOrders.sort((a,b) => a.TongTien - b.TongTien);

      let dhHtml = '';
      uiFilteredOrders.forEach(dh => {
         let badge = dh.TrangThai === 'Đã thanh toán' ? 'badge-success' : 'badge-danger';
         if (dh.TrangThai === 'Trả góp') badge = 'badge-dark';
         
         let khObj = appData.KHACHHANG.find(k => k.MaKH === dh.MaKH);
         let tenKH = khObj ? khObj.TenKH : '';
         
         let btnXoa = !isSales ? `<button class="btn-cancel" style="padding:4px 8px; font-size:12px; background-color: var(--danger); color: white;" onclick="deleteOrder('${dh.MaDH}')">Xóa</button>` : '';

         dhHtml += `<tr>
            <td><b>${dh.MaDH}</b></td><td>${dh.Ngay}</td><td>${dh.MaKH} - ${tenKH}</td>
            <td><span class="badge ${badge}">${dh.TrangThai}</span></td>
            <td>${dh.MaNV}</td>
            <td><b>${fm(dh.TongTien)}</b> đ</td>
            <td>
              <button class="btn-action" style="padding:4px 8px; font-size:12px; margin-right:5px;" onclick="viewOrderDetails('${dh.MaDH}')">Xem</button>
              ${btnXoa}
            </td>
         </tr>`;
      });
      document.querySelector('#tbl-don-hang tbody').innerHTML = dhHtml;

      // 4. KHO SẢN PHẨM
      let uiFilteredProducts = [...appData.SANPHAM];

      let fInvSearch = document.getElementById('filter-inv-search')?.value.toLowerCase();
      if(fInvSearch) {
          uiFilteredProducts = uiFilteredProducts.filter(sp => sp.MaSP.toLowerCase().includes(fInvSearch) || sp.TenSP.toLowerCase().includes(fInvSearch));
      }

      let fInvType = document.getElementById('filter-inv-type')?.value;
      if(fInvType) uiFilteredProducts = uiFilteredProducts.filter(sp => sp.TenLoaiSP === fInvType);

      let fInvSMin = document.getElementById('filter-inv-stockmin')?.value;
      if(fInvSMin !== "" && !isNaN(fInvSMin)) uiFilteredProducts = uiFilteredProducts.filter(sp => sp.TonKho >= parseFloat(fInvSMin));
      
      let fInvSMax = document.getElementById('filter-inv-stockmax')?.value;
      if(fInvSMax !== "" && !isNaN(fInvSMax)) uiFilteredProducts = uiFilteredProducts.filter(sp => sp.TonKho <= parseFloat(fInvSMax));

      let fInvWarn = document.getElementById('filter-inv-warning')?.value;
      if(fInvWarn) {
          if(fInvWarn === 'Yêu cầu Nhập') uiFilteredProducts = uiFilteredProducts.filter(sp => sp.TonKho < 20);
          if(fInvWarn === 'Ổn định') uiFilteredProducts = uiFilteredProducts.filter(sp => sp.TonKho >= 20);
      }

      // Sort Inv
      let sInv = document.getElementById('sort-inv')?.value;
      if(sInv === 'MaSP_asc') uiFilteredProducts.sort((a,b) => a.MaSP.localeCompare(b.MaSP));
      else if(sInv === 'MaSP_desc') uiFilteredProducts.sort((a,b) => b.MaSP.localeCompare(a.MaSP));
      else if(sInv === 'Gia_asc') uiFilteredProducts.sort((a,b) => a.DonGia - b.DonGia);
      else if(sInv === 'Gia_desc') uiFilteredProducts.sort((a,b) => b.DonGia - a.DonGia);
      else if(sInv === 'Ton_asc') uiFilteredProducts.sort((a,b) => a.TonKho - b.TonKho);
      else if(sInv === 'Ton_desc') uiFilteredProducts.sort((a,b) => b.TonKho - a.TonKho);

      let spHtml = '';
      uiFilteredProducts.forEach(sp => {
         let textAlert = sp.TonKho < 20 ? '<span class="badge badge-danger">Yêu cầu Nhập</span>' : '<span class="badge badge-success">Ổn định</span>';
         let btnAction = !isSales ? `
             <button class="btn-action" style="padding:4px 8px; font-size:12px; margin-right:5px;" onclick="editProduct('${sp.MaSP}')">Sửa</button>
             <button class="btn-cancel" style="padding:4px 8px; font-size:12px; background-color: var(--danger); color: white;" onclick="deleteProduct('${sp.MaSP}')">Xóa</button>
         ` : '';
         
         let actionTd = !isSales ? `<td>${btnAction}</td>` : '';
         
         spHtml += `<tr>
           <td>${sp.MaSP}</td><td><b>${sp.TenSP}</b></td><td>${sp.TenLoaiSP}</td>
           <td>${fm(sp.DonGia)}</td><td><b>${sp.TonKho}</b></td><td>${textAlert}</td>
           ${actionTd}
         </tr>`;
      });
      document.querySelector('#tbl-san-pham tbody').innerHTML = spHtml;

      // 5. KHÁCH HÀNG (CRM)
      let uiFilteredCustomers = [...appData.KHACHHANG];

      let fCrmSearch = document.getElementById('filter-crm-search')?.value.toLowerCase();
      if(fCrmSearch) {
          uiFilteredCustomers = uiFilteredCustomers.filter(kh => 
              kh.TenKH.toLowerCase().includes(fCrmSearch) || 
              kh.SDT.toLowerCase().includes(fCrmSearch) || 
              kh.MaKH.toLowerCase().includes(fCrmSearch)
          );
      }
      
      let fCrmAddress = document.getElementById('filter-crm-address')?.value;
      if(fCrmAddress) uiFilteredCustomers = uiFilteredCustomers.filter(kh => kh.DiaChi === fCrmAddress);
      
      let fCrmType = document.getElementById('filter-crm-type')?.value;
      if(fCrmType) uiFilteredCustomers = uiFilteredCustomers.filter(kh => kh.LoaiKH === fCrmType);

      // Sort KH programmatically
      if (crmSortCol && crmSortDir > 0) {
          uiFilteredCustomers.sort((a, b) => {
              let valA = a[crmSortCol] || '';
              let valB = b[crmSortCol] || '';
              let cmp = String(valA).localeCompare(String(valB));
              return crmSortDir === 1 ? cmp : -cmp;
          });
          
          // Update icons
          resetCrmSortIcons();
          const targetIcon = document.getElementById('sort-icon-' + crmSortCol);
          if (targetIcon) {
              targetIcon.style.opacity = '1';
              if (crmSortDir === 1) { // asc -> up bold
                  targetIcon.innerHTML = '<span class="up" style="color:var(--text-main); font-weight:bold;">▲</span><span class="down">▼</span>';
              } else { // desc -> down bold
                  targetIcon.innerHTML = '<span class="up">▲</span><span class="down" style="color:var(--text-main); font-weight:bold;">▼</span>';
              }
          }
      } else {
          resetCrmSortIcons();
      }
      
      // Pagination
      let pagedCustomers = uiFilteredCustomers.slice(0, crmLimit);
      window._currentCrmVisible = pagedCustomers; // Store for "select all"

      let crmHtml = '';
      pagedCustomers.forEach(kh => {
         let isChecked = crmSelected.has(kh.MaKH) ? 'checked' : '';
         
         let isExpanded = crmExpanded.has(kh.MaKH);
         let expandedClass = isExpanded ? 'expanded' : '';
         let ptrEventsCb = `onclick="event.stopPropagation()"`; // prevent row click when clicking checkbox

         crmHtml += `<tr class="crm-row ${expandedClass}" style="cursor: pointer;" onclick="toggleCrmExpand('${kh.MaKH}')">
           <td style="text-align: center;" ${ptrEventsCb}><input type="checkbox" ${isChecked} onchange="toggleCrmSelect('${kh.MaKH}')"></td>
           <td><b>${kh.MaKH}</b></td><td>${kh.TenKH}</td><td>${kh.SDT}</td>
           <td>${kh.DiaChi}</td><td><span class="badge badge-dark">${kh.LoaiKH}</span></td>
         </tr>`;
         
         if (isExpanded) {
             let initials = kh.TenKH.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase();
             let defaultNgayTao = "31/05/2026";
             let defaultNguoiTao = "Mai Tấn Phát"; // Hoặc có thể lấy Admin nếu muốn mock
             
             let delBtn = !isSales ? `<button class="btn-cancel" onclick="event.stopPropagation(); window.delCust('${kh.MaKH}')" style="background:none; border:none; color:var(--danger); font-size:14px; font-weight:600; cursor:pointer; padding:5px 10px; display:flex; align-items:center; gap:5px;"><span style="font-size:16px">🗑️</span> Xóa</button>` : '';
             
             crmHtml += `<tr class="crm-expanded-row" style="background-color: #fcfcfd;">
                <td colspan="6" style="padding: 20px;">
                   <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 25px; cursor: default;" onclick="event.stopPropagation()">
                      
                      <!-- Tabs Fake -->
                      <div style="display:flex; gap: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px; font-size:14px; font-weight:600; color:var(--text-muted);">
                          <div style="color:#4b6584; border-bottom:2px solid #4b6584; padding-bottom:10px; margin-bottom:-11px;">Thông tin</div>
                          
                          
                          <div style="margin-left: auto; font-weight:400; font-size:13px;">Chi nhánh trung tâm</div>
                      </div>

                      <!-- Header Info -->
                      <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                          <div style="width: 80px; height: 80px; border-radius: 50%; background: #e2e8f0; display:flex; align-items:center; justify-content:center; flex-shrink: 0; font-size: 32px; font-weight: bold; color: #64748b;"><svg viewBox="0 0 24 24" width="40" height="40" fill="#9ca3af"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                          </div>
                          <div>
                              <div style="font-size: 20px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">${kh.TenKH} - ${kh.DiaChi.split(',')[0]} <span style="font-size:14px; font-weight:normal; color:#888; margin-left:10px;">${kh.MaKH}</span></div>
                              <div style="font-size: 13px; color: var(--text-muted); display:flex; gap:15px; margin-bottom: 5px;">
                                  <span>Người tạo: <span style="color:var(--text-main)">${defaultNguoiTao}</span></span>
                                  <span style="color:#d1d5db">|</span>
                                  <span>Ngày tạo: <span style="color:var(--text-main)">${defaultNgayTao}</span></span>
                                  <span style="color:#d1d5db">|</span>
                                  <span>Nhóm khách: <span style="color:var(--text-main)">${kh.LoaiKH}</span></span>
                              </div>
                          </div>
                      </div>

                      <!-- Grid Info -->
                      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px; border-bottom:1px solid #f0f0f0; padding-bottom:20px;">
                          <div>
                              <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Điện thoại</div>
                              <div style="font-size:14px; color:${kh.SDT ? 'var(--text-main)' : '#aaa'}; font-weight:500;">${kh.SDT || 'Chưa có'}</div>
                          </div>
                          <div>
                              <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Sinh nhật</div>
                              <div style="font-size:14px; color:${kh.SinhNhat ? 'var(--text-main)' : '#aaa'}; font-weight:500;">${kh.SinhNhat || 'Chưa có'}</div>
                          </div>
                          <div>
                              <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Giới tính</div>
                              <div style="font-size:14px; color:${kh.GioiTinh ? 'var(--text-main)' : '#aaa'}; font-weight:500;">${kh.GioiTinh || 'Chưa có'}</div>
                          </div>
                          
                          <div>
                              <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Email</div>
                              <div style="font-size:14px; color:${kh.Email ? 'var(--text-main)' : '#aaa'}; font-weight:500;">${kh.Email || 'Chưa có'}</div>
                          </div>
                          <div>
                              <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Facebook</div>
                              <div style="font-size:14px; color:${kh.Facebook ? 'var(--text-main)' : '#aaa'}; font-weight:500;">${kh.Facebook || 'Chưa có'}</div>
                          </div>
                          <div></div>

                          <div style="grid-column: span 3;">
                              <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Địa chỉ</div>
                              <div style="font-size:14px; color:${kh.DiaChi ? 'var(--text-main)' : '#aaa'}; font-weight:500;">${kh.DiaChi || 'Chưa có'}</div>
                          </div>
                      </div>

                      

                      <!-- Footer Buttons -->
                      <div style="display: flex; justify-content: space-between; align-items: center; padding-top:10px;">
                          <div>${delBtn}</div>
                          <div style="display:flex; gap:10px;">
                             <button class="btn-action" style="background:#4b6584; border-radius: 6px; padding: 8px 15px;" onclick="event.stopPropagation(); window.editCust('${kh.MaKH}')"><span style="margin-right:5px">✏️</span> Chỉnh sửa</button>
                             
                          </div>
                      </div>

                   </div>
                </td>
             </tr>`;
         }
      });
      document.querySelector('#tbl-khach-hang tbody').innerHTML = crmHtml;

      // Update "Select All" checkbox state
      const selectAllCb = document.getElementById('crm-select-all');
      if (selectAllCb) {
          if (pagedCustomers.length > 0 && pagedCustomers.every(kh => crmSelected.has(kh.MaKH))) {
              selectAllCb.checked = true;
          } else {
              selectAllCb.checked = false;
          }
      }

      // 6. NHÂN SỰ
      if(!isSales) {
         let nvHtml = '';
         let userMap = {};
         appData.TAIKHOAN.forEach(t => userMap[t.MaNV] = t.TenNV);
         
         let hieuSuatMap = {};
         appData.DONHANG.forEach(dh => {
            if(!hieuSuatMap[dh.MaNV]) hieuSuatMap[dh.MaNV] = { soDon: 0, sale: 0, kh: new Set() };
            hieuSuatMap[dh.MaNV].soDon += 1;
            hieuSuatMap[dh.MaNV].sale += dh.TongTien;
            hieuSuatMap[dh.MaNV].kh.add(dh.MaKH);
         });

         appData.TAIKHOAN.forEach(tk => {
             let sale = hieuSuatMap[tk.MaNV]?.sale || 0;
             let soDon = hieuSuatMap[tk.MaNV]?.soDon || 0;
             let khachPhuTrach = hieuSuatMap[tk.MaNV]?.kh.size || 0;
             let statusBadge = (tk.TrangThai === 'Đã Thu Hồi') ? '<span class="badge badge-danger">Đã Thu Hồi</span>' : '<span class="badge badge-success">Hoạt động</span>';
             let actionBtns = '';
             if(tk.username !== 'admin') {
                actionBtns = `
                  <button class="btn-action" style="padding:4px 8px; font-size:12px; margin-right:5px;" onclick="editStaff('${tk.MaNV}')">Sửa</button>
                  ${tk.TrangThai !== 'Đã Thu Hồi' ? `<button class="btn-cancel" style="padding:4px 8px; font-size:12px; background-color: var(--danger); color: white;" onclick="revokeStaff('${tk.MaNV}')">Thu Hồi</button>` : ''}
                `;
             }
             nvHtml += `<tr>
                <td><b>${tk.MaNV}</b></td><td>${tk.TenNV}</td><td>${tk.Quyen === 'Admin' ? 'Quản trị' : 'Sales'}</td>
                <td>${statusBadge}</td><td>${khachPhuTrach}</td><td>${soDon}</td><td><b>${fm(sale)} đ</b></td>
                <td>${actionBtns}</td>
             </tr>`;
         });
         document.querySelector('#tbl-nhan-vien tbody').innerHTML = nvHtml;
         
         // Update internal counters
         const tCount = appData.TAIKHOAN.length;
         const iCount = appData.TAIKHOAN.filter(t => t.TrangThai === 'Đã Thu Hồi').length;
         const aCount = tCount - iCount;
         document.getElementById('total-staff-count').innerText = tCount;
         document.getElementById('active-staff-count').innerText = aCount;
         document.getElementById('inactive-staff-count').innerText = iCount;
      }
    }

    function calcNotifications() {
      const alerts = appData.SANPHAM.filter(x => x.TonKho < 20);
      document.getElementById('noti-badge').innerText = alerts.length;
      
      document.getElementById('warning-count-text').innerText = alerts.length;

      const notiList = document.getElementById('noti-list');
      notiList.innerHTML = '';
      if(alerts.length === 0) {
        notiList.innerHTML = '<div class="noti-item safe"><strong>Tuyệt vời!</strong>Mọi chỉ số kho đều an toàn không cần nhập thêm.</div>';
      } else {
        alerts.forEach(s => {
          notiList.innerHTML += `<div class="noti-item danger"><strong>⚠️ Cảnh báo Thiếu hụt</strong>SP <span style="color:var(--danger)">${s.TenSP}</span> (Mã ${s.MaSP}) lọt vòng nguy hiểm, chỉ còn <b>${s.TonKho}</b>. Yêu cầu nhập gấp!</div>`;
        });
      }
    }

    function buildFormSelects() {
      const sKh = document.getElementById('modal-dathang-khachhang');
      sKh.innerHTML = appData.KHACHHANG.map(kh => `<option value="${kh.MaKH}">${kh.TenKH} (Mã: ${kh.MaKH})</option>`).join('');
      
      const sSp = document.getElementById('modal-sanpham');
      sSp.innerHTML = appData.SANPHAM.map(sp => `<option value="${sp.MaSP}">${sp.TenSP} - Tồn: ${sp.TonKho} - Giá: ${fm(sp.DonGia)}</option>`).join('');

      updateKhachHangInfo();
    }

    function updateKhachHangInfo() {
      let ma = document.getElementById('modal-dathang-khachhang')?.value;
      let kh = appData.KHACHHANG.find(k => k.MaKH === ma);
      if(kh) {
         let el = document.getElementById('modal-dathang-diachi');
         if(el) el.value = kh.DiaChi;
      }
    }

    /* 4. CRUD FORMS & ACTIONS */

    
    // CRM Helper functions
    function toggleCrmSort(col) {
        if (crmSortCol === col) {
            crmSortDir = (crmSortDir + 1) % 3;
            if (crmSortDir === 0) crmSortCol = null;
        } else {
            crmSortCol = col;
            crmSortDir = 1;
        }
        renderTables();
    }
    
    
    
    function toggleCrmExpand(maKH) {
        if (crmExpanded.has(maKH)) crmExpanded.delete(maKH);
        else crmExpanded.add(maKH);
        renderTables();
    }
    window.delCust = function(maKH) {
        deleteCustomer(maKH);
    }
    window.editCust = function(maKH) {
        editCustomer(maKH);
    }

    function resetCrmSortIcons() {
        document.querySelectorAll('.sort-icon').forEach(el => {
            el.innerHTML = '<span class="up">▲</span><span class="down">▼</span>';
            el.style.opacity = '0.3';
        });
    }

    function toggleCrmSelectAll() {
        const isChecked = document.getElementById('crm-select-all').checked;
        const visibleRows = window._currentCrmVisible || [];
        if (isChecked) {
            visibleRows.forEach(kh => crmSelected.add(kh.MaKH));
        } else {
            visibleRows.forEach(kh => crmSelected.delete(kh.MaKH));
        }
        renderTables();
    }
    
    function toggleCrmSelect(maKH) {
        if (crmSelected.has(maKH)) crmSelected.delete(maKH);
        else crmSelected.add(maKH);
        renderTables();
    }
    
    function changeCrmLimit() {
        crmLimit = parseInt(document.getElementById('crm-page-limit').value, 10);
        renderTables();
    }

    
    // List of 34 major provinces/cities according to user request (or just an acceptable list)
    const provincesList = [
        "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", 
        "Hải Dương", "Hưng Yên", "Vĩnh Phúc", "Khánh Hòa", "Bình Thuận", 
        "Ninh Thuận", "Bình Định", "Phú Yên", "Quảng Ninh", "Quảng Nam", 
        "Quảng Ngãi", "Bình Dương", "Đồng Nai", "Bà Rịa - Vũng Tàu", "Tây Ninh", 
        "Bình Phước", "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Bình", 
        "Quảng Trị", "Thừa Thiên Huế", "Lâm Đồng", "Đắk Lắk", "Gia Lai", 
        "Kon Tum", "Đắk Nông", "Kiên Giang", "Cà Mau"
    ];

    const wardsByProvince = {
        "Cần Thơ": ["Phường An Bình", "Phường An Cư", "Phường An Hòa", "Phường An Khánh", "Phường An Nghiệp", "Phường An Phú", "Phường Bùi Hữu Nghĩa", "Phường Cái Khế", "Phường Châu Văn Liêm", "Phường Hưng Lợi", "Phường Hưng Phú", "Phường Hưng Thạnh", "Phường Lê Bình", "Phường Tân An", "Phường Thới Bình", "Phường Trà An", "Phường Trà Nóc", "Phường Xuân Khánh", "Xã Giai Xuân", "Xã Mỹ Khánh"],
        "Hà Nội": ["Phường Quán Thánh", "Phường Ngọc Hà", "Phường Điện Biên", "Phường Đội Cấn", "Phường Ngọc Khánh", "Phường Kim Mã", "Phường Giảng Võ", "Phường Tràng Tiền", "Phường Lý Thái Tổ", "Phường Phan Chu Trinh", "Phường Hàng Đào", "Xã Cổ Loa"],
        "Hồ Chí Minh": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cô Giang", "Phường Cầu Ông Lãnh", "Phường Đa Kao", "Phường Phạm Ngũ Lão", "Phường Nguyễn Thái Bình", "Phường 1 (Quận 3)", "Phường 2 (Quận 3)", "Phường 3 (Quận 3)", "Phường Thảo Điền", "Phường An Phú", "Xã Bình Chánh", "Xã Phước Kiển"],
        "Đà Nẵng": ["Phường Hải Châu I", "Phường Hải Châu II", "Phường Thạch Thang", "Phường Thanh Bình", "Phường Thuận Phước", "Phường Vĩnh Trung", "Phường Thọ Quang", "Phường Nại Hiên Đông"],
        "Hải Phòng": ["Phường Phan Bội Châu", "Phường Hoàng Văn Thụ", "Phường Quang Trung", "Phường Minh Khai", "Phường Phạm Hồng Thái"]
    };

    function showKuvucSuggest() {
        renderSuggestList('khuvuc-suggest', provincesList, document.getElementById('modal-khuvuckh').value, selectKhuvuc);
    }
    
    function filterKuvuc() {
        showKuvucSuggest();
    }
    
    function selectKhuvuc(val) {
        document.getElementById('modal-khuvuckh').value = val;
        hideAutocomplete('khuvuc-suggest');
        document.getElementById('modal-phuongxakh').value = ''; // reset phuong
    }
    
    function showPhuongxaSuggest() {
        const city = document.getElementById('modal-khuvuckh').value;
        // mock some wards if city not in dictionary
        let list = wardsByProvince[city] || ["Phường 1", "Phường 2", "Phường 3", "Xã 1"];
        if(!city) list = ["Vui lòng chọn Khu vực trước"];
        
        renderSuggestList('phuongxa-suggest', list, document.getElementById('modal-phuongxakh').value, (val) => {
            if(val !== "Vui lòng chọn Khu vực trước") {
                document.getElementById('modal-phuongxakh').value = val;
                hideAutocomplete('phuongxa-suggest');
            }
        });
    }
    
    function filterPhuongxa() {
        showPhuongxaSuggest();
    }

    function hideAutocomplete(id) {
        document.getElementById(id).style.display = 'none';
    }

    function renderSuggestList(id, list, inputVal, onSelect) {
        const container = document.getElementById(id);
        const filtered = list.filter(item => item.toLowerCase().includes((inputVal||'').toLowerCase()));
        
        container.innerHTML = '';
        if(filtered.length === 0) {
            container.innerHTML = '<div style="padding: 10px; color:#888;">Không tìm thấy</div>';
            container.style.display = 'block';
            return;
        }

        filtered.forEach(item => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 10px 15px; cursor: pointer; border-bottom: 1px solid #f0f0f0;';
            div.innerText = item;
            div.onmousedown = (e) => { // use mousedown to fire before blur
               e.preventDefault(); 
               onSelect(item);
            };
            div.onmouseover = () => div.style.background = '#f9fafb';
            div.onmouseout = () => div.style.background = 'white';
            container.appendChild(div);
        });
        
        container.style.display = 'block';
    }

    // Modal Style updates
    const modalCustomStyle = document.createElement('style');
    modalCustomStyle.innerHTML = `
        .autocomplete-list {
            scrollbar-width: thin;
        }
    `;
    document.head.appendChild(modalCustomStyle);

    // --- MODULE: KHACH HANG ---
    function openCustomerModal() {
      document.getElementById('modal-iscrmedit').value = '0';
      document.getElementById('modal-iscrmview').value = '0';
      document.getElementById('modal-crmid').value = '';
      
      const fields = ['modal-tenkh', 'modal-sdtkh', 'modal-sdt2kh', 'modal-snkh', 'modal-gioitinhkh', 'modal-emailkh', 'modal-fbkh', 'modal-diachikh', 'modal-khuvuckh', 'modal-phuongxakh', 'modal-loaikh'];
      fields.forEach(f => {
          let el = document.getElementById(f);
          if (el) {
             el.disabled = false;
             el.value = '';
          }
      });
      document.getElementById('modal-gioitinhkh').value = 'Khác';
      document.getElementById('modal-loaikh').value = 'Chưa có';
      document.getElementById('modal-crmid-display').value = 'Tự động';

      document.getElementById('customer-modal-title').innerText = 'Tạo khách hàng';
      document.getElementById('customer-modal-footer').style.display = 'flex';
      
      document.getElementById('customer-modal').classList.add('show');
    }
    
    function viewCustomer(maKH) {
      const kh = appData.KHACHHANG.find(x => x.MaKH === maKH);
      if(!kh) return showToast("Không tìm thấy Khách Hàng", true);
      
      document.getElementById('modal-iscrmedit').value = '0';
      document.getElementById('modal-iscrmview').value = '1';
      document.getElementById('modal-crmid').value = kh.MaKH;

      const fields = ['modal-tenkh', 'modal-sdtkh', 'modal-sdt2kh', 'modal-snkh', 'modal-gioitinhkh', 'modal-emailkh', 'modal-fbkh', 'modal-diachikh', 'modal-khuvuckh', 'modal-phuongxakh', 'modal-loaikh'];
      
      document.getElementById('modal-tenkh').value = kh.TenKH || '';
      document.getElementById('modal-sdtkh').value = kh.SDT || '';
      document.getElementById('modal-sdt2kh').value = kh.SDT2 || '';
      document.getElementById('modal-snkh').value = kh.SinhNhat || '';
      document.getElementById('modal-gioitinhkh').value = kh.GioiTinh || 'Khác';
      document.getElementById('modal-emailkh').value = kh.Email || '';
      document.getElementById('modal-fbkh').value = kh.Facebook || '';
      document.getElementById('modal-diachikh').value = kh.DiaChi?.split(',')[0] || '';
      document.getElementById('modal-khuvuckh').value = kh.KhuVuc || kh.DiaChi?.split(',')[2]?.trim() || '';
      document.getElementById('modal-phuongxakh').value = kh.PhuongXa || kh.DiaChi?.split(',')[1]?.trim() || '';
      document.getElementById('modal-loaikh').value = kh.LoaiKH || 'Chưa có';

      document.getElementById('modal-crmid-display').value = kh.MaKH;

      fields.forEach(f => {
          let el = document.getElementById(f);
          if (el) el.disabled = true;
      });
      
      document.getElementById('customer-modal-title').innerText = 'Xem Thông Tin Khách Hàng';
      document.getElementById('customer-modal-footer').style.display = 'none';

      document.getElementById('customer-modal').classList.add('show');
    }

    function editCustomer(maKH) {
      const kh = appData.KHACHHANG.find(x => x.MaKH === maKH);
      if(!kh) return showToast("Không tìm thấy Khách Hàng", true);
      
      document.getElementById('modal-iscrmedit').value = '1';
      document.getElementById('modal-iscrmview').value = '0';
      document.getElementById('modal-crmid').value = kh.MaKH;

      const fields = ['modal-tenkh', 'modal-sdtkh', 'modal-sdt2kh', 'modal-snkh', 'modal-gioitinhkh', 'modal-emailkh', 'modal-fbkh', 'modal-diachikh', 'modal-khuvuckh', 'modal-phuongxakh', 'modal-loaikh'];
      
      document.getElementById('modal-tenkh').value = kh.TenKH || '';
      document.getElementById('modal-sdtkh').value = kh.SDT || '';
      document.getElementById('modal-sdt2kh').value = kh.SDT2 || '';
      document.getElementById('modal-snkh').value = kh.SinhNhat || '';
      document.getElementById('modal-gioitinhkh').value = kh.GioiTinh || 'Khác';
      document.getElementById('modal-emailkh').value = kh.Email || '';
      document.getElementById('modal-fbkh').value = kh.Facebook || '';
      document.getElementById('modal-diachikh').value = kh.DiaChi?.split(',')[0] || '';
      document.getElementById('modal-khuvuckh').value = kh.KhuVuc || kh.DiaChi?.split(',')[2]?.trim() || '';
      document.getElementById('modal-phuongxakh').value = kh.PhuongXa || kh.DiaChi?.split(',')[1]?.trim() || '';
      document.getElementById('modal-loaikh').value = kh.LoaiKH || 'Chưa có';

      document.getElementById('modal-crmid-display').value = kh.MaKH;

      fields.forEach(f => {
          let el = document.getElementById(f);
          if (el) el.disabled = false;
      });
      
      document.getElementById('customer-modal-title').innerText = 'Sửa khách hàng';
      document.getElementById('customer-modal-footer').style.display = 'flex';

      document.getElementById('customer-modal').classList.add('show');
    }

    function deleteCustomer(maKH) {
      if (currentUser.Quyen === 'Sales') return showToast("Chỉ Admin được xóa", true);
      showConfirm('Khách hàng này và toàn bộ dữ liệu lịch sử sẽ bị xóa. Tiếp tục?', () => {
         appData.KHACHHANG = appData.KHACHHANG.filter(x => x.MaKH !== maKH);
         localStorage.setItem('adminAppData', JSON.stringify(appData));
         renderTables();
         calcAndDrawCharts();
         showToast("Đã xóa Khách Hàng thành công");
      });
    }
    
    function closeCustomerModal() { document.getElementById('customer-modal').classList.remove('show'); }
    
    function submitCustomer() {
      const isEdit = document.getElementById('modal-iscrmedit')?.value === '1';
      const crmId = document.getElementById('modal-crmid')?.value;

      const tenKH = document.getElementById('modal-tenkh').value.trim();
      const sdtKH = document.getElementById('modal-sdtkh').value.trim();
      const sdt2KH = (document.getElementById('modal-sdt2kh')?.value || '').trim();
      const snKH = (document.getElementById('modal-snkh')?.value || '').trim();
      const gtKH = (document.getElementById('modal-gioitinhkh')?.value || '').trim();
      const emailKH = (document.getElementById('modal-emailkh')?.value || '').trim();
      const fbKH = (document.getElementById('modal-fbkh')?.value || '').trim();
      
      const dcKH = document.getElementById('modal-diachikh').value.trim();
      const kvKH = (document.getElementById('modal-khuvuckh')?.value || '').trim();
      const pxKH = (document.getElementById('modal-phuongxakh')?.value || '').trim();
      const loaiKH = document.getElementById('modal-loaikh').value;

      if(!tenKH) return showToast("Tên KH không được trống", true);

      let fullDiaChi = dcKH;
      if (pxKH) fullDiaChi += (fullDiaChi ? ', ' : '') + pxKH;
      if (kvKH) fullDiaChi += (fullDiaChi ? ', ' : '') + kvKH;

      if (isEdit) {
         const kh = appData.KHACHHANG.find(x => x.MaKH === crmId);
         if(kh) {
            kh.TenKH = tenKH;
            kh.SDT = sdtKH;
            kh.SDT2 = sdt2KH;
            kh.SinhNhat = snKH;
            kh.GioiTinh = gtKH;
            kh.Email = emailKH;
            kh.Facebook = fbKH;
            kh.DiaChi = fullDiaChi;
            kh.KhuVuc = kvKH;
            kh.PhuongXa = pxKH;
            kh.LoaiKH = loaiKH;
         }
         localStorage.setItem('adminAppData', JSON.stringify(appData));
         buildFormSelects();
         calcAndDrawCharts();
         renderTables();
         closeCustomerModal();
         showToast("Đã cập nhật Khách hàng thành công");
      } else {
         let maxId = 0;
         appData.KHACHHANG.forEach(kh => {
             let num = parseInt(kh.MaKH.replace('KH', ''));
             if (!isNaN(num) && num > maxId) maxId = num;
         });
         let newMaKH = 'KH' + String(maxId + 1).padStart(6, '0');

         appData.KHACHHANG.unshift({
            MaKH: newMaKH, TenKH: tenKH, SDT: sdtKH, SDT2: sdt2KH, SinhNhat: snKH, GioiTinh: gtKH, Email: emailKH, Facebook: fbKH, 
            DiaChi: fullDiaChi, KhuVuc: kvKH, PhuongXa: pxKH, LoaiKH: loaiKH, 
            TongMua: 0, No: 0
         });
         localStorage.setItem('adminAppData', JSON.stringify(appData));
         
         buildFormSelects();
         calcAndDrawCharts();
         renderTables();
         closeCustomerModal();
         showToast("Khách hàng đã được tạo. Mã hệ thống: " + newMaKH);

         // Cố gắng switch popup nếu đang tạo đơn hàng
         let sKh = document.getElementById('modal-dathang-khachhang');
         if (sKh) sKh.value = newMaKH;
      }
    }

    // --- MODULE: ORDER ---
    function openOrderModal() { document.getElementById('order-modal').classList.add('show'); }
    function closeOrderModal() { document.getElementById('order-modal').classList.remove('show'); }
    
    function viewOrderDetails(maDH) {
      const tb = document.querySelector('#tbl-chi-tiet-don-hang tbody'); tb.innerHTML = '';
      const items = (appData.CTDH||[]).filter(i => i.MaDH === maDH);
      
      if (items.length === 0) {
        tb.innerHTML = '<tr><td colspan="6" style="text-align:center;">Không tìm thấy CTĐH</td></tr>';
      } else {
        items.forEach(i => {
          tb.innerHTML += `<tr><td><b>${i.MaDH}</b></td><td>${i.MaSP}</td><td>${i.SoLuong}</td>
          <td>${fm(i.DonGia)} đ</td><td>${(i.GiamGia * 100).toFixed(1)}%</td><td><b>${fm(i.TongTien)}</b> đ</td></tr>`;
        });
      }
      document.getElementById('detail-modal-title').innerText = `Chi Tiết Đơn Hàng [${maDH}]`;
      document.getElementById('order-details-modal').classList.add('show');
    }

    function closeOrderDetailsModal() { document.getElementById('order-details-modal').classList.remove('show'); }

    function submitOrder() {
      const maKH = document.getElementById('modal-dathang-khachhang').value;
      const maSP = document.getElementById('modal-sanpham').value;
      const qt = parseInt(document.getElementById('modal-soluong').value || 0);
      const gg = parseFloat(document.getElementById('modal-giamgia').value || 0);
      const tt = document.getElementById('modal-trangthai').value;

      const targetSp = appData.SANPHAM.find(x => x.MaSP === maSP);
      
      if (qt <= 0) return showToast('Số lượng phải > 0', true);
      if (qt > targetSp.TonKho) return showToast(`Kho không đủ. Chỉ còn ${targetSp.TonKho}`, true);
      if (gg < 0 || gg > 100) return showToast('Giảm giá lỗi (0 - 100%)', true);

      // Trừ Kho
      targetSp.TonKho -= qt;

      // Sinh Đơn Hàng
      const discount = gg / 100;
      const value = targetSp.DonGia * qt * (1 - discount);
      const randTxt = Math.floor(10000 + Math.random()*90000);
      const newDh = {
        MaDH: `DH${randTxt}`,
        Ngay: (() => { let n=new Date(); return n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')+' '+String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0'); })(),
        MaKH: maKH,
        TrangThai: tt,
        TongTien: value,
        MaNV: currentUser.MaNV
      };
      appData.DONHANG.unshift(newDh);
      
      const newCtdh = {
        MaDH: `DH${randTxt}`, MaSP: targetSp.MaSP, SoLuong: qt, DonGia: targetSp.DonGia, TongTien: value, GiamGia: discount
      };
      if (!appData.CTDH) appData.CTDH = [];
      appData.CTDH.unshift(newCtdh);

      localStorage.setItem('adminAppData', JSON.stringify(appData));
      
      buildFormSelects();
      calcAndDrawCharts();
      renderTables();
      calcNotifications();
      closeOrderModal();
      showToast('Đơn hàng ' + newDh.MaDH + ' tạo T.Công!');
    }

    function deleteOrder(maDH) {
      if (currentUser.Quyen === 'Sales') return showToast("Nhân viên Sales bị chặn tác vụ Xóa Đơn Hàng!", true);
      
      showConfirm('Xóa đơn VĨNH VIỄN ' + maDH + ' - Phục hồi kèm tồn kho tương ứng?', () => {
        const dhIdx = appData.DONHANG.findIndex(x => x.MaDH === maDH);
        if (dhIdx === -1) return;
        
        // Phục hồi kho
        if (appData.CTDH) {
          appData.CTDH.filter(x => x.MaDH === maDH).forEach(ct => {
             const sp = appData.SANPHAM.find(s => s.MaSP === ct.MaSP);
             if(sp) sp.TonKho += ct.SoLuong;
          });
          appData.CTDH = appData.CTDH.filter(x => x.MaDH !== maDH);
        }

        appData.DONHANG.splice(dhIdx, 1);
        localStorage.setItem('adminAppData', JSON.stringify(appData));
        buildFormSelects();
        calcAndDrawCharts();
        renderTables();
        calcNotifications();
        showToast('Đã xóa ' + maDH);
      });
    }

    // --- MODULE: SAN PHAM ---
    function openProductModal() {
      document.getElementById('product-modal-title').innerText = 'Thêm Sản Phẩm Mới';
      document.getElementById('modal-masp').value = ''; document.getElementById('modal-masp').disabled = false;
      document.getElementById('modal-tensp').value = '';
      document.getElementById('modal-dongiasp').value = 0; document.getElementById('modal-tonkhosp').value = 0;
      document.getElementById('modal-iseditsp').value = '0';
      document.getElementById('product-modal').classList.add('show');
    }
    
    function closeProductModal() { document.getElementById('product-modal').classList.remove('show'); }
    
    function editProduct(maSP) {
      const sp = appData.SANPHAM.find(x => x.MaSP === maSP);
      if(!sp) return;
      document.getElementById('product-modal-title').innerText = 'Chỉnh Sửa Sản Phẩm';
      document.getElementById('modal-masp').value = sp.MaSP; document.getElementById('modal-masp').disabled = true;
      document.getElementById('modal-tensp').value = sp.TenSP; document.getElementById('modal-maloaisp').value = sp.TenLoaiSP;
      document.getElementById('modal-dongiasp').value = sp.DonGia; document.getElementById('modal-tonkhosp').value = sp.TonKho;
      document.getElementById('modal-iseditsp').value = '1';
      document.getElementById('product-modal').classList.add('show');
    }

    function submitProduct() {
      const isEdit = document.getElementById('modal-iseditsp').value === '1';
      const m = document.getElementById('modal-masp').value.trim();
      const t = document.getElementById('modal-tensp').value.trim();
      const g = parseFloat(document.getElementById('modal-dongiasp').value || 0);
      const k = parseInt(document.getElementById('modal-tonkhosp').value || 0);

      if(!m || !t) return showToast("Trường mã và tên bắt buộc", true);
      if(k < 0) return showToast("Kho không được âm", true);
      
      if(isEdit) {
        const sp = appData.SANPHAM.find(x => x.MaSP === m);
        if(sp) { sp.TenSP = t; sp.TenLoaiSP = document.getElementById('modal-maloaisp').value; sp.DonGia = g; sp.TonKho = k; }
      } else {
        if(appData.SANPHAM.some(x => x.MaSP === m)) return showToast("Trùng Mã Sản Phẩm!", true);
        appData.SANPHAM.push({ MaSP: m, TenSP: t, TenLoaiSP: document.getElementById('modal-maloaisp').value, DonGia: g, TonKho: k });
      }
      
      localStorage.setItem('adminAppData', JSON.stringify(appData));
      buildFormSelects();
      renderTables();
      calcNotifications();
      closeProductModal();
      showToast("Xử lý Danh mục sản phẩm Thành Công");
    }

    function deleteProduct(maSP) {
      if (currentUser.Quyen === 'Sales') return showToast("Chỉ Admin được xóa Kho", true);

      showConfirm('Quyết định xóa SP ' + maSP + ' khỏi hệ thống?', () => {
        let isInOrder = appData.CTDH && appData.CTDH.some(ct => ct.MaSP === maSP);
        if(isInOrder) return showToast("Lỗi Khóa Ngoại: SP đang liên kết với Đơn Hàng đã phát sinh", true);
        
        appData.SANPHAM = appData.SANPHAM.filter(x => x.MaSP !== maSP);
        localStorage.setItem('adminAppData', JSON.stringify(appData));
        buildFormSelects();
        renderTables();
        calcNotifications();
        showToast('Bay màu SP ' + maSP);
      });
    }

    // --- MODULE: STAFF ---
    function openStaffModal() {
      let maxId = 0;
      appData.TAIKHOAN.forEach(nv => {
          if (nv.MaNV.startsWith('NV')) {
            let num = parseInt(nv.MaNV.replace('NV', ''));
            if (!isNaN(num) && num > maxId) maxId = num;
          }
      });
      let newMaNV = 'NV' + String(maxId + 1).padStart(2, '0');

      document.getElementById('modal-iseditstaff').value = '0';
      document.getElementById('modal-manv').value = newMaNV;
      document.getElementById('modal-tennv').value = '';
      document.getElementById('modal-quyennv').value = 'Sales';
      document.getElementById('staff-modal-title').innerText = 'Thêm Nhân Viên Mới';
      document.getElementById('staff-modal').classList.add('show');
    }

    function closeStaffModal() {
      document.getElementById('staff-modal').classList.remove('show');
    }

    function editStaff(maNV) {
      if (currentUser.Quyen === 'Sales') return showToast("Chỉ Admin được sửa Nhân Sự", true);
      const nv = appData.TAIKHOAN.find(x => x.MaNV === maNV);
      if(!nv) return showToast("Không tìm thấy Nhân Viên", true);
      
      document.getElementById('modal-manv').value = nv.MaNV;
      document.getElementById('modal-tennv').value = nv.TenNV;
      document.getElementById('modal-quyennv').value = nv.Quyen;
      document.getElementById('modal-iseditstaff').value = '1';
      document.getElementById('staff-modal-title').innerText = 'Sửa Thông Tin Nhân Viên';
      document.getElementById('staff-modal').classList.add('show');
    }

    function submitStaff() {
      const isEdit = document.getElementById('modal-iseditstaff').value === '1';
      const m = document.getElementById('modal-manv').value.trim();
      const t = document.getElementById('modal-tennv').value.trim();
      const q = document.getElementById('modal-quyennv').value;

      if(!m || !t) return showToast("Trường mã và tên bắt buộc", true);
      
      if(isEdit) {
        const nv = appData.TAIKHOAN.find(x => x.MaNV === m);
        if(nv) { nv.TenNV = t; nv.Quyen = q; }
      } else {
        if(appData.TAIKHOAN.some(x => x.MaNV === m)) return showToast("Trùng Mã Nhân Viên!", true);
        appData.TAIKHOAN.push({
           username: m,
           password: '123',
           Quyen: q,
           MaNV: m,
           TenNV: t,
           TrangThai: 'Hoạt động'
        });
      }
      
      localStorage.setItem('adminAppData', JSON.stringify(appData));
      calcAndDrawCharts();
      renderTables();
      closeStaffModal();
      showToast("Cập nhật Nhân Sự Thành Công");
    }

    function revokeStaff(maNV) {
      if (currentUser.Quyen === 'Sales') return showToast("Chỉ Admin được sử dụng", true);

      showConfirm('Quyết định thu hồi truy cập của NV ' + maNV + '?', () => {
        let nv = appData.TAIKHOAN.find(x => x.MaNV === maNV);
        if (nv) {
          nv.TrangThai = 'Đã Thu Hồi';
          nv.password = 'REVOKED';
          localStorage.setItem('adminAppData', JSON.stringify(appData));
          renderTables();
          showToast('Đã thu hồi quyền của NV ' + maNV);
        }
      });
    }

    /* 5. NAVIGATION & EXPORT */
    function toggleSidebar() { document.getElementById('sidebar').classList.toggle('collapsed'); }

    function switchModule(modId, element) {
      document.querySelectorAll('.section-module').forEach(el => el.classList.remove('active'));
      document.getElementById('module-' + modId).classList.add('active');
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      element.classList.add('active');
      document.getElementById('module-title').innerText = element.querySelector('.nav-text').innerText;
    }

    function toggleNoti() { document.getElementById('right-sidebar').classList.toggle('collapsed'); }
    
    // Removed click outside listener so right sidebar stays open

    function exportData(tableId, filename) {
      if(!window.XLSX) return showToast("Không tải được Module JSON to Excel", true);
      const elt = document.getElementById(tableId);
      const clone = elt.cloneNode(true);
      if (tableId === 'tbl-don-hang' || tableId === 'tbl-san-pham') {
        const rows = clone.rows;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].cells.length > 0) rows[i].deleteCell(-1); // Delete Hành động
        }
      }
      const fnameFinal = `${filename}_${currentUser.MaNV}_Export.xlsx`;
      const wb = XLSX.utils.table_to_book(clone, {sheet:"Data Base"});
      XLSX.writeFile(wb, fnameFinal);
      showToast(`Chiết xuất Thành công. Đang tải (${fnameFinal})`);
    }
  