const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/\\`Ngày \\\${/g, '`Ngày ${');
html = html.replace(/} tháng \\\${/g, '} tháng ${');
html = html.replace(/} năm \\\${/g, '} năm ${');
html = html.replace(/d.getFullYear\(\)}\\\`/g, 'd.getFullYear()}`');

html = html.replace(/itemsHtml \+= \\`<tr>/g, 'itemsHtml += `<tr>');
html = html.replace(/itemsHtml \+= \\`<tr/g, 'itemsHtml += `<tr');
html = html.replace(/normal;">\\\${/g, 'normal;">${');
html = html.replace(/10px;">\\\${/g, '10px;">${');
html = html.replace(/center;">\\\${/g, 'center;">${');
html = html.replace(/right;">\\\${/g, 'right;">${');
html = html.replace(/<\/tr>\\`/g, '</tr>`');

html = html.replace(/printWindow.document.write\(\\`<html>/g, 'printWindow.document.write(`<html>');
html = html.replace(/In hóa đơn \\\${maDH}/g, 'In hóa đơn ${maDH}');

html = html.replace(/Số HĐ: HD\\\${/g, 'Số HĐ: HD${');
html = html.replace(/<div>\\\${dateStr}<\/div>/g, '<div>${dateStr}</div>');
html = html.replace(/Khách hàng: \\\${kh/g, 'Khách hàng: ${kh');
html = html.replace(/SĐT: \\\${kh/g, 'SĐT: ${kh');
html = html.replace(/Địa chỉ: \\\${kh/g, 'Địa chỉ: ${kh');

html = html.replace(/<tbody>\s*\\\${itemsHtml}\s*<\/tbody>/, '<tbody>\n                ${itemsHtml}\n            </tbody>');
html = html.replace(/<td class="col-3">\\\${fm/g, '<td class="col-3">${fm');
html = html.replace(/10px;">\\\${docTien}/g, '10px;">${docTien}');

html = html.replace(/<\\\\\/script>/g, '</script>');
html = html.replace(/<\/html>\\`\);/g, '</html>`);');

fs.writeFileSync('index.html', html);
