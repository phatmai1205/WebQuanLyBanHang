const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(`    appData.DONHANG.unshift({
        MaDH: newMaDH,
        NgayTao: new Date().toISOString(),
        MaKH: maKH,
        KhachHang: posSelectedCustomer ? posSelectedCustomer.TenKH : 'Khách lẻ',
        TongTien: sum,
        DaTra: final,
        NhanVien: staffObj ? staffObj.TenNV : currentUser?.TenNV,
        TrangThai: 'Hoàn thành'
    });`, `    appData.DONHANG.unshift({
        MaDH: newMaDH,
        Ngay: new Date().toISOString().substring(0, 10),
        MaKH: maKH,
        TrangThai: 'Đã thanh toán',
        TongTien: sum,
        MaNV: staffId
    });
    if(!appData.CTDH) appData.CTDH = [];
    posCart.forEach(item => {
        appData.CTDH.push({
            MaDH: newMaDH,
            MaSP: item.MaSP,
            SoLuong: item.qty,
            DonGia: item.DonGia,
            TongTien: item.DonGia * item.qty,
            GiamGia: 0
        });
    });`);

fs.writeFileSync('index.html', html);
console.log('Fixed DONHANG schema in POS');
