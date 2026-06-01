const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regexSubmitModal = /function submitCustomer\(\) \{[\s\S]*?showToast\("Khách hàng đã được tạo. Mã hệ thống: " \+ newMaKH\);\s*\n\s*\/\/ Cố gắng switch popup nếu đang tạo đơn hàng\s*\n\s*let sKh = document.getElementById\('modal-dathang-khachhang'\);\s*\n\s*if \(sKh\) sKh.value = newMaKH;\s*\n\s*\}\s*\}/;

const newSubmitModal = `function submitCustomer() {
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
    }`;

html = html.replace(regexSubmitModal, newSubmitModal);

fs.writeFileSync('index.html', html);
console.log('Replaced submitCustomer');
