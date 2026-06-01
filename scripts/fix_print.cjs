const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add the Print button next to 'Lưu'
const printBtnHtml = `<button class="btn-cancel" onclick="event.stopPropagation(); printOrder('\${dh.MaDH}')" style="padding: 8px 16px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 5px; background: white;"><span style="font-size: 16px;">🖨️</span> In</button>`;

const oldButtons = `<button class="btn-action" onclick="event.stopPropagation(); showToast('Đã lưu thông tin hóa đơn!');" style="padding: 8px 16px; background-color: var(--primary); color: white; display: flex; align-items: center; gap: 5px;"><span style="font-size: 16px;">💾</span> Lưu</button>`;

html = html.replace(oldButtons, printBtnHtml + '\n                              ' + oldButtons);

// 2. Add printOrder function
const printOrderFunc = `      function docSo(so) {
        if (!so || so === 0) return "Không đồng chẵn";
        const mangso = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
        const scales = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ"];
        
        let words = [];
        let numStr = Math.round(so).toString();
        let scaleIdx = 0;
        
        while (numStr.length > 0) {
            let chunk = numStr.substring(Math.max(0, numStr.length - 3));
            numStr = numStr.substring(0, Math.max(0, numStr.length - 3));
            let chunkVal = parseInt(chunk);
            if (chunkVal > 0) {
                let chunkWords = [];
                let h = Math.floor(chunkVal / 100);
                let rem = chunkVal % 100;
                let t = Math.floor(rem / 10);
                let o = rem % 10;
                
                if (h > 0) chunkWords.push(mangso[h] + " trăm");
                else if (numStr.length > 0) chunkWords.push("không trăm"); 
                
                if (t === 0 && o > 0 && h > 0) chunkWords.push("lẻ");
                
                if (t === 1) chunkWords.push("mười");
                else if (t > 1) chunkWords.push(mangso[t] + " mươi");
                
                if (o > 0) {
                    if (t > 1 && o === 1) chunkWords.push("mốt");
                    else if (t > 0 && o === 5) chunkWords.push("lăm");
                    else chunkWords.push(mangso[o]);
                }
                
                if (scales[scaleIdx]) chunkWords.push(scales[scaleIdx]);
                words.unshift(chunkWords.join(" "));
            }
            scaleIdx++;
        }
        
        let finalStr = words.join(" ").replace(/ /g, " ").replace(/  +/g, " ").trim();
        return "(" + finalStr.charAt(0).toUpperCase() + finalStr.slice(1) + " đồng chẵn)";
      }

      function printOrder(maDH) {
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

        let printWindow = window.open('', '', 'height=600,width=400');
        printWindow.document.write(\`<html><head><title>In hóa đơn \${maDH}</title>
            <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; color: #000; margin: 0; padding: 20px; }
                .center { text-align: center; }
                .bold { font-weight: bold; }
                .title { font-size: 16px; font-weight: bold; margin: 10px 0 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th { border-bottom: 1px solid #000; border-top: 1px solid #000; padding: 5px 0; text-align: left; }
                td { padding: 3px 0; }
                .summary { margin-top: 10px; width: 100%; }
                .summary td { padding: 3px 0; }
            </style>
        </head><body>
            <div class="center">
                <div style="font-size: 24px; font-weight: bold; color: #00a8ff; margin-bottom: 5px;">
                    <span style="display:inline-block; width:15px; height:15px; border-radius:50%; background:#00a8ff; margin-right:2px;"></span>
                    <span style="display:inline-block; width:15px; height:25px; border-radius:15px; background:#4cd137; margin-right:5px; transform:translateY(3px);"></span>
                    MTP
                </div>
                <div>Địa chỉ: - -</div>
                <div>Điện thoại: 0939815328</div>
                <div class="title">HÓA ĐƠN BÁN HÀNG</div>
                <div>Số HĐ: \${dh.MaDH}</div>
                <div>\${dateStr}</div>
            </div>
            <div style="margin-top: 15px;">
                <div>Khách hàng: \${kh ? kh.TenKH : "Khách lẻ"}</div>
                <div>SĐT: \${kh && kh.SDT ? kh.SDT : ""}</div>
                <div>Địa chỉ: \${kh && kh.DiaChi ? kh.DiaChi : "- -"}</div>
                <div>Số CCCD:</div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 40%">Đơn giá</th>
                        <th style="width: 20%; text-align: center;">SL</th>
                        <th style="width: 40%; text-align: right;">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    \${itemsHtml}
                </tbody>
            </table>
            <table class="summary">
                <tr>
                    <td style="font-weight: bold; width: 60%; text-align: right;">Tổng tiền hàng:</td>
                    <td style="font-weight: bold; width: 40%; text-align: right;">\${fm(tongTienHang)}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; text-align: right;">Chiết khấu:</td>
                    <td style="font-weight: bold; text-align: right;">\${fm(tongGiamGia)}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; text-align: right;">Tổng thanh toán:</td>
                    <td style="font-weight: bold; text-align: right;">\${fm(tongTienHang - tongGiamGia)}</td>
                </tr>
            </table>
            <div style="margin-top: 10px; font-style: italic;">\${docTien}</div>
            <div class="center" style="margin-top: 30px;">
                <div style="font-weight: bold;">Quét mã thanh toán</div>
                <div style="margin-top: 20px; font-style: italic;">Cảm ơn và hẹn gặp lại!</div>
            </div>
            <script>
                window.onload = function() { window.print(); window.close(); }
            </script>
        </body></html>\`);
        printWindow.document.close();
      }

      function initSystem`;

html = html.replace('function initSystem', printOrderFunc);

fs.writeFileSync('index.html', html);
