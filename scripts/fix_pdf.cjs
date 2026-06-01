const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('html2pdf')) {
    html = html.replace(
        '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>',
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>\\n    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>'
    );
}

const oldPrintFuncSearch = 'function printOrder(maDH) {';

// Let's use string operations to replace the printOrder function
const startIdx = html.indexOf(oldPrintFuncSearch);
if (startIdx !== -1) {
    const endIdx = html.indexOf('function initSystem', startIdx);
    
    if (endIdx !== -1) {
        const newPrintFunc = `function printOrder(maDH) {
        let dh = appData.DONHANG.find((d) => d.MaDH === maDH);
        if (!dh) return;

        let kh = appData.KHACHHANG.find((k) => k.MaKH === dh.MaKH);
        let ct = appData.CTDH.filter((c) => c.MaDH === maDH);

        let d = new Date(dh.Ngay);
        let dateStr = \`Ngày \${("0"+d.getDate()).slice(-2)} tháng \${("0"+(d.getMonth()+1)).slice(-2)} năm \${d.getFullYear()}\`;
        
        let itemsHtml = "";
        let tongTienHang = 0;
        let tongGiamGia = 0;
        
        ct.forEach(c => {
           let sp = appData.SANPHAM.find(p => p.MaSP === c.MaSP);
           let tenSP = sp ? sp.TenSP : "Sản phẩm";
           tongTienHang += c.DonGia * c.SoLuong;
           let giam = (c.GiamGia || 0);
           tongGiamGia += c.DonGia * c.SoLuong * giam;
           let thanhTien = c.DonGia * c.SoLuong - (c.DonGia * c.SoLuong * giam);
           
           itemsHtml += \`<tr style="border-bottom: 1px dashed #ccc;">
               <td colspan="3" style="padding-top: 5px; font-weight: 500;">\${tenSP}</td>
           </tr>
           <tr style="border-bottom: 1px dashed #ccc;">
               <td style="padding-bottom: 5px;">\${fm(c.DonGia)}</td>
               <td style="padding-bottom: 5px; text-align: center;">\${c.SoLuong}</td>
               <td style="padding-bottom: 5px; text-align: right;">\${fm(thanhTien)}</td>
           </tr>\`;
        });

        let docTien = docSo(dh.TongTien || (tongTienHang - tongGiamGia));

        let invoiceHtml = \`<div style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; color: #000; padding: 20px; width: 400px; max-width: 100%; box-sizing: border-box;">
            <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #00a8ff; margin-bottom: 5px;">
                    <span style="display:inline-block; width:15px; height:15px; border-radius:50%; background:#00a8ff; margin-right:2px;"></span>
                    <span style="display:inline-block; width:15px; height:25px; border-radius:15px; background:#4cd137; margin-right:5px; transform:translateY(3px);"></span>
                    MTP
                </div>
                <div>Địa chỉ: - -</div>
                <div>Điện thoại: 0939815328</div>
                <div style="font-size: 16px; font-weight: bold; margin: 10px 0 5px;">HÓA ĐƠN BÁN HÀNG</div>
                <div>Số HĐ: \${dh.MaDH}</div>
                <div>\${dateStr}</div>
            </div>
            <div style="margin-top: 15px;">
                <div>Khách hàng: \${kh ? kh.TenKH : "Khách lẻ"}</div>
                <div>SĐT: \${kh && kh.SDT ? kh.SDT : ""}</div>
                <div>Địa chỉ: \${kh && kh.DiaChi ? kh.DiaChi : "- -"}</div>
                <div>Số CCCD:</div>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr>
                        <th style="width: 40%; border-bottom: 1px solid #000; border-top: 1px solid #000; padding: 5px 0; text-align: left;">Đơn giá</th>
                        <th style="width: 20%; border-bottom: 1px solid #000; border-top: 1px solid #000; padding: 5px 0; text-align: center;">SL</th>
                        <th style="width: 40%; border-bottom: 1px solid #000; border-top: 1px solid #000; padding: 5px 0; text-align: right;">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    \${itemsHtml}
                </tbody>
            </table>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr>
                    <td style="font-weight: bold; width: 60%; text-align: right; padding: 3px 0;">Tổng tiền hàng:</td>
                    <td style="font-weight: bold; width: 40%; text-align: right; padding: 3px 0;">\${fm(tongTienHang)}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; text-align: right; padding: 3px 0;">Chiết khấu:</td>
                    <td style="font-weight: bold; text-align: right; padding: 3px 0;">\${fm(tongGiamGia)}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; text-align: right; padding: 3px 0;">Tổng thanh toán:</td>
                    <td style="font-weight: bold; text-align: right; padding: 3px 0;">\${fm(tongTienHang - tongGiamGia)}</td>
                </tr>
            </table>
            <div style="margin-top: 10px; font-style: italic;">\${docTien}</div>
            <div style="text-align: center; margin-top: 30px;">
                <div style="font-weight: bold;">Quét mã thanh toán</div>
                <div style="margin-top: 20px; font-style: italic;">Cảm ơn và hẹn gặp lại!</div>
            </div>
        </div>\`;

        // Create a hidden div to hold the invoice
        let container = document.createElement('div');
        container.innerHTML = invoiceHtml;
        document.body.appendChild(container);

        var opt = {
          margin:       0.5,
          filename:     maDH + '.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Output and download pdf
        html2pdf().set(opt).from(container).save().then(() => {
            document.body.removeChild(container);
        });
      }

      `;
        
        html = html.substring(0, startIdx) + newPrintFunc + html.substring(endIdx);
        fs.writeFileSync('index.html', html);
    }
}
