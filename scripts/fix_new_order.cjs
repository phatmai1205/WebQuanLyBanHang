const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Update button
html = html.replace('onclick="openOrderModal()">\n                  + Tạo Đơn Hàng Mới', 'onclick="goToPosForNewOrder()">\n                  + Tạo Đơn Hàng Mới');
// try another pattern if formatting changed
html = html.replace('onclick="openOrderModal()">\n+ Tạo Đơn Hàng Mới', 'onclick="goToPosForNewOrder()">\n+ Tạo Đơn Hàng Mới');
html = html.replace('onclick="openOrderModal()">+ Tạo Đơn Hàng Mới', 'onclick="goToPosForNewOrder()">+ Tạo Đơn Hàng Mới');

const oldBtn = `<button class="btn-action" onclick="openOrderModal()">`;
if (html.includes(oldBtn) && html.indexOf(oldBtn) > 1000) {
    // we use regex to be safe
    html = html.replace(/<button class="btn-action" onclick="openOrderModal\(\)">\s*\+\s*Tạo Đơn Hàng Mới\s*<\/button>/, `<button class="btn-action" onclick="goToPosForNewOrder()">\n                  + Tạo Đơn Hàng Mới\n                </button>`);
}

// Add goToPosForNewOrder
const scriptToAdd = `      function goToPosForNewOrder() {
        posEditingOrder = null;
        posCart = [];
        posSelectedCustomer = null;
        document.getElementById("pos-customer-search").value = "";
        
        let posNavEl = Array.from(document.querySelectorAll(".nav-item")).find(el => el.innerText.includes("Bán hàng"));
        if (posNavEl) {
           switchModule("pos", posNavEl);
        }
        
        updatePosCartUI();
      }

      function openOrderModal`;
html = html.replace('function openOrderModal', scriptToAdd);

fs.writeFileSync('index.html', html);
console.log('Done mapping new order button to POS');
