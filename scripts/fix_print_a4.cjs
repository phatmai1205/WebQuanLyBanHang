const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /function printOrder\(maDH\) \{([\s\S]*?)\}\n\n      function initSystem/m;

const newPrint = `function printOrder(maDH) {
        let dh = appData.DONHANG.find((d) => d.MaDH === maDH);
        if (!dh) return;

        let kh = appData.KHACHHANG.find((k) => k.MaKH === dh.MaKH);
        let ct = appData.CTDH.filter((c) => c.MaDH === maDH);

        let d = new Date(dh.Ngay);
        let dateStr = \\\`Ngày \\\${("0" + d.getDate()).slice(-2)} tháng \\\${("0" + (d.getMonth() + 1)).slice(-2)} năm \\\${d.getFullYear()}\\\`;

        let itemsHtml = "";
        let tongTienHang = 0;
        let tongGiamGia = 0;

        ct.forEach((c) => {
          let sp = appData.SANPHAM.find((p) => p.MaSP === c.MaSP);
          let tenSP = sp ? sp.TenSP : "Sản phẩm";
          tongTienHang += c.DonGia * c.SoLuong;
          let giam = c.GiamGia || 0;
          tongGiamGia += c.DonGia * c.SoLuong * giam;
          let thanhTien = c.DonGia * c.SoLuong - c.DonGia * c.SoLuong * giam;

          itemsHtml += \\\`<tr style="border-bottom: 1px dashed #000;">
               <td colspan="3" style="padding-top: 10px; font-weight: normal;">\\\${tenSP}</td>
           </tr>
           <tr style="border-bottom: 1px dashed #000;">
               <td style="padding-bottom: 10px;">\\\${fm(c.DonGia)}</td>
               <td style="padding-bottom: 10px; text-align: center;">\\\${c.SoLuong}</td>
               <td style="padding-bottom: 10px; text-align: right;">\\\${fm(thanhTien)}</td>
           </tr>\\\`;
        });

        let docTien = docSo(dh.TongTien || tongTienHang - tongGiamGia);

        let printWindow = window.open('', '_blank');
        printWindow.document.write(\\\`<html>
<head>
    <title>In hóa đơn \\\${maDH}</title>
    <style>
        @page { margin: 10mm 15mm; size: A4 portrait; }
        body { 
            font-family: 'Arial', sans-serif; 
            font-size: 14px; 
            color: #000; 
            margin: 0; 
            padding: 0;
            line-height: 1.5;
        }
        .header-content {
            text-align: center;
        }
        .logo-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 15px;
        }
        .logo-text {
            font-size: 36px;
            font-weight: bold;
            color: #0d2e59;
            font-family: Arial, sans-serif;
            letter-spacing: -0.5px;
        }
        .logo-text span {
            color: #00A8FF;
        }
        .company-name {
            font-size: 15px;
            font-weight: bold;
            margin-top: 10px;
        }
        .address, .phone {
            font-size: 14px;
        }
        .invoice-title {
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0 5px;
        }
        .customer-info {
            margin-top: 30px;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th {
            border-bottom: 2px solid #000;
            border-top: 2px solid #000;
            padding: 10px 0;
            font-weight: bold;
        }
        th.col-price { width: 50%; text-align: left; }
        th.col-qty { width: 20%; text-align: center; }
        th.col-total { width: 30%; text-align: right; }
        
        .summary-table {
            margin-top: 20px;
        }
        .summary-table td {
            padding: 5px 0;
        }
        .summary-table .col-1 { width: 40%; }
        .summary-table .col-2 { width: 40%; text-align: right; font-weight: bold; }
        .summary-table .col-3 { width: 20%; text-align: right; font-weight: bold; }
        
        .footer {
            text-align: center; 
            margin-top: 60px;
        }
        .qr-text {
            font-weight: bold;
            margin-bottom: 30px;
        }
        .thank-you {
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header-content">
        <div class="logo-wrap">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M48.8,11.5 C27.6,11.5 10.4,28.7 10.4,50 C10.4,71.3 27.6,88.5 48.8,88.5 C48.8,88.5 48.8,11.5 48.8,11.5 Z" fill="#00A8FF"/>
                <path d="M51.2,50 C51.2,28.7 68.4,11.5 89.6,11.5 C89.6,11.5 51.2,88.5 51.2,88.5 C51.2,88.5 51.2,50 51.2,50 Z" fill="#4CD137"/>
            </svg>
            <div class="logo-text">Kiot<span>Viet</span></div>
        </div>
        <div class="company-name">maiphat</div>
        <div class="address">Địa chỉ: - -</div>
        <div class="phone">Điện thoại: 0939815328</div>
        
        <div class="invoice-title">HÓA ĐƠN BÁN HÀNG</div>
        <div>Số HĐ: HD\\\${("000000" + dh.MaDH.replace(/\\D/g, '')).slice(-6)}</div>
        <div>\\\${dateStr}</div>
    </div>
    
    <div class="customer-info">
        <div>Khách hàng: \\\${kh ? kh.TenKH : "Khách lẻ"}</div>
        <div>SĐT: \\\${kh && kh.SDT ? kh.SDT : ""}</div>
        <div>Địa chỉ: \\\${kh && kh.DiaChi ? kh.DiaChi : "- -"}</div>
        <div>Số CCCD:</div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th class="col-price">Đơn giá</th>
                <th class="col-qty">SL</th>
                <th class="col-total">Thành tiền</th>
            </tr>
        </thead>
        <tbody>
            \\\${itemsHtml}
        </tbody>
    </table>
    
    <table class="summary-table">
        <tr>
            <td class="col-1"></td>
            <td class="col-2">Tổng tiền hàng:</td>
            <td class="col-3">\\\${fm(tongTienHang)}</td>
        </tr>
        <tr>
            <td class="col-1"></td>
            <td class="col-2">Chiết khấu :</td>
            <td class="col-3">\\\${fm(tongGiamGia)}</td>
        </tr>
        <tr>
            <td class="col-1"><div style="font-style: italic; margin-top: 10px;">\\\${docTien}</div></td>
            <td class="col-2">Tổng thanh toán:</td>
            <td class="col-3">\\\${fm(tongTienHang - tongGiamGia)}</td>
        </tr>
    </table>
    
    <div class="footer">
        <div class="qr-text">Quét mã thanh toán</div>
        <div class="thank-you">Cảm ơn và hẹn gặp lại!</div>
    </div>
    
    <script>
        window.onload = function() { 
            setTimeout(() => {
                window.print();
                window.close();
            }, 500); 
        }
    <\\\\/script>
</body>
</html>\\\`);
        printWindow.document.close();
      }

      function initSystem`;

html = html.replace(regex, newPrint);
fs.writeFileSync('index.html', html);
