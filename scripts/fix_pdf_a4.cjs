const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /let invoiceHtml = `([\s\S]*?)`;\s+\/\/ Create a hidden div/;

const newInvoiceHtml = `let invoiceHtml = \\\`<div style="font-family: 'Arial', sans-serif; font-size: 14px; color: #000; padding: 40px; width: 794px; box-sizing: border-box; background: white;">
            <div style="text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #020202; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <div style="display:flex;">
                      <div style="width:20px; height:40px; background:#00a8ff; border-radius: 20px 0 0 20px;"></div>
                      <div style="width:20px; height:40px; background:#4cd137; border-radius: 0 20px 20px 0; transform: scale(0.8);"></div>
                    </div>
                    MTP
                </div>
                <div style="font-size: 15px; font-weight: bold; margin-top: 10px;">maiphat</div>
                <div>Địa chỉ: - -</div>
                <div>Điện thoại: 0939815328</div>
                
                <div style="font-size: 18px; font-weight: bold; margin: 20px 0 5px;">HÓA ĐƠN BÁN HÀNG</div>
                <div>Số HĐ: \${dh.MaDH}</div>
                <div>\${dateStr}</div>
            </div>
            
            <div style="margin-top: 30px; line-height: 1.5;">
                <div>Khách hàng: \${kh ? kh.TenKH : "Khách lẻ"}</div>
                <div>SĐT: \${kh && kh.SDT ? kh.SDT : ""}</div>
                <div>Địa chỉ: \${kh && kh.DiaChi ? kh.DiaChi : "- -"}</div>
                <div>Số CCCD:</div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr>
                        <th style="width: 50%; border-bottom: 2px solid #000; border-top: 2px solid #000; padding: 10px 0; text-align: left;">Đơn giá</th>
                        <th style="width: 20%; border-bottom: 2px solid #000; border-top: 2px solid #000; padding: 10px 0; text-align: center;">SL</th>
                        <th style="width: 30%; border-bottom: 2px solid #000; border-top: 2px solid #000; padding: 10px 0; text-align: right;">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    \${itemsHtml}
                </tbody>
            </table>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                    <td style="width: 50%;"></td>
                    <td style="font-weight: bold; width: 30%; text-align: right; padding: 5px 0;">Tổng tiền hàng:</td>
                    <td style="font-weight: bold; width: 20%; text-align: right; padding: 5px 0;">\${fm(tongTienHang)}</td>
                </tr>
                <tr>
                    <td></td>
                    <td style="font-weight: bold; text-align: right; padding: 5px 0;">Chiết khấu :</td>
                    <td style="font-weight: bold; text-align: right; padding: 5px 0;">\${fm(tongGiamGia)}</td>
                </tr>
                <tr>
                    <td><div style="font-style: italic; margin-top: 10px;">\${docTien}</div></td>
                    <td style="font-weight: bold; text-align: right; padding: 5px 0;">Tổng thanh toán:</td>
                    <td style="font-weight: bold; text-align: right; padding: 5px 0;">\${fm(tongTienHang - tongGiamGia)}</td>
                </tr>
            </table>
            
            <div style="text-align: center; margin-top: 60px;">
                <div style="font-weight: bold; margin-bottom: 30px;">Quét mã thanh toán</div>
                <div style="font-style: italic;">Cảm ơn và hẹn gặp lại!</div>
            </div>
        </div>\\\`;

        // Create a hidden div`;

html = html.replace(regex, newInvoiceHtml);

// We need to also modify itemsHtml generating part so that it matches exactly what was shown in the PDF
// i.e., "Bánh mì Staff chà bông 55gr", then underneath "0   1   0", and dotted line below it.

const oldItemsGen = `ct.forEach((c) => {
          let sp = appData.SANPHAM.find((p) => p.MaSP === c.MaSP);
          let tenSP = sp ? sp.TenSP : "Sản phẩm";
          tongTienHang += c.DonGia * c.SoLuong;
          let giam = c.GiamGia || 0;
          tongGiamGia += c.DonGia * c.SoLuong * giam;
          let thanhTien = c.DonGia * c.SoLuong - c.DonGia * c.SoLuong * giam;

          itemsHtml += \\\`<tr style="border-bottom: 1px dashed #ccc;">
               <td colspan="3" style="padding-top: 5px; font-weight: 500;">\${tenSP}</td>
           </tr>
           <tr style="border-bottom: 1px dashed #ccc;">
               <td style="padding-bottom: 5px;">\${fm(c.DonGia)}</td>
               <td style="padding-bottom: 5px; text-align: center;">\${c.SoLuong}</td>
               <td style="padding-bottom: 5px; text-align: right;">\${fm(thanhTien)}</td>
           </tr>\\\`;
        });`;

const newItemsGen = `ct.forEach((c) => {
          let sp = appData.SANPHAM.find((p) => p.MaSP === c.MaSP);
          let tenSP = sp ? sp.TenSP : "Sản phẩm";
          tongTienHang += c.DonGia * c.SoLuong;
          let giam = c.GiamGia || 0;
          tongGiamGia += c.DonGia * c.SoLuong * giam;
          let thanhTien = c.DonGia * c.SoLuong - c.DonGia * c.SoLuong * giam;

          itemsHtml += \\\`<tr>
               <td colspan="3" style="padding-top: 10px; font-weight: normal;">\${tenSP}</td>
           </tr>
           <tr>
               <td style="padding-bottom: 10px;">\${fm(c.DonGia)}</td>
               <td style="padding-bottom: 10px; text-align: center;">\${c.SoLuong}</td>
               <td style="padding-bottom: 10px; text-align: right;">\${fm(thanhTien)}</td>
           </tr>
           <tr>
               <td colspan="3" style="border-bottom: 1px dashed #000;"></td>
           </tr>\\\`;
        });`;

html = html.replace(oldItemsGen, newItemsGen);

fs.writeFileSync('index.html', html);
