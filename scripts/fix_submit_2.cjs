const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const submitSearch = `        if (isEdit) {
          const sp = appData.SANPHAM.find((x) => x.MaSP === m);
          if (sp) {
            sp.TenSP = t;
            sp.TenLoaiSP = document.getElementById("modal-maloaisp").value;
            sp.DonGia = g;
            sp.TonKho = k;
          }
        } else {
          if (appData.SANPHAM.some((x) => x.MaSP === m))
            return showToast("Trùng Mã Sản Phẩm!", true);
          appData.SANPHAM.push({
            MaSP: m,
            TenSP: t,
            TenLoaiSP: document.getElementById("modal-maloaisp").value,
            DonGia: g,
            TonKho: k,
          });
        }`;

const submitReplace = `        let hinhAnhBase64 = document.getElementById('modal-hinh-anh').value;
        if (isEdit) {
          const sp = appData.SANPHAM.find((x) => x.MaSP === m);
          if (sp) {
            sp.TenSP = t;
            sp.TenLoaiSP = document.getElementById("modal-maloaisp").value;
            sp.DonGia = g;
            sp.TonKho = k;
            if (hinhAnhBase64) sp.HinhAnh = hinhAnhBase64;
          }
        } else {
          if (appData.SANPHAM.some((x) => x.MaSP === m))
            return showToast("Trùng Mã Sản Phẩm!", true);
          appData.SANPHAM.push({
            MaSP: m,
            TenSP: t,
            TenLoaiSP: document.getElementById("modal-maloaisp").value,
            DonGia: g,
            TonKho: k,
            HinhAnh: hinhAnhBase64
          });
        }`;

if (html.includes(submitSearch)) {
    html = html.replace(submitSearch, submitReplace);
    fs.writeFileSync('index.html', html);
    console.log('Fixed submit');
} else {
    console.log('Not found');
}
