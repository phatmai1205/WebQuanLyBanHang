const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regexFilterBar = /<div class="filter-bar">[\s\S]*?(<button\s*class="btn-cancel"\s*style="[\s\S]*?Xóa Filter\s*<\/button>\s*<\/div>)/;

const newFilterBar = `<div class="search-container" style="position: relative; max-width: 600px; margin-bottom: 20px;" id="crm-search-container">
              <!-- search input wrapper -->
              <div style="display: flex; align-items: center; border: 1px solid var(--border-color); border-radius: 8px; background: white; padding: 5px 10px;">
                <span style="font-size: 18px; color: #888; margin-right: 5px;">🔍</span>
                <input type="text" id="filter-crm-search-main" placeholder="Theo mã, tên, số điện thoại" style="flex: 1; border: none; outline: none; padding: 8px; font-size: 14px;" oninput="syncCrmSearchMain()">
                <button onclick="toggleCrmAdvancedSearch()" style="background: #f1f3f4; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y1="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                </button>
              </div>
              
              <!-- advanced search popup -->
              <div id="crm-advanced-search" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 15px; margin-top: 5px; z-index: 100;">
                <div style="display: flex; flex-direction: column; gap: 10px;">
                  <input type="text" id="filter-crm-adv-search" placeholder="Theo mã, tên, số điện thoại" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; outline: none; font-size: 14px;" oninput="syncCrmSearchAdv()">
                  <input type="text" id="filter-crm-adv-email" placeholder="Theo email" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; outline: none; font-size: 14px;">
                  <input type="text" id="filter-crm-adv-address" placeholder="Theo địa chỉ" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; outline: none; font-size: 14px;">
                </div>
                <div style="display: flex; justify-content: flex-end; margin-top: 15px;">
                  <button class="btn-action" onclick="executeCrmSearch()" style="background-color: #4a627a; color: white;">Tìm kiếm</button>
                </div>
              </div>
            </div>`;

if (regexFilterBar.test(html)) {
    html = html.replace(regexFilterBar, newFilterBar);
} else {
    console.log("Not found regex for filter bar CRM.");
}

fs.writeFileSync('index.html', html);
