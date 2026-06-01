const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regexFilterLogic = /let fCrmSearch = document[\s\S]*?if\s*\(fCrmType\)\s*uiFilteredCustomers = uiFilteredCustomers\.filter\([\s\S]*?\);\n/m;

const newFilterLogic = `        let fCrmSearch = document.getElementById("filter-crm-search-main")?.value.toLowerCase() || document.getElementById("filter-crm-adv-search")?.value.toLowerCase();
        if (fCrmSearch) {
          uiFilteredCustomers = uiFilteredCustomers.filter(
            (kh) =>
              kh.TenKH.toLowerCase().includes(fCrmSearch) ||
              kh.SDT.toLowerCase().includes(fCrmSearch) ||
              kh.MaKH.toLowerCase().includes(fCrmSearch),
          );
        }

        let fCrmEmail = document.getElementById("filter-crm-adv-email")?.value.toLowerCase();
        if (fCrmEmail) {
          uiFilteredCustomers = uiFilteredCustomers.filter(
            (kh) => (kh.Email || "").toLowerCase().includes(fCrmEmail)
          );
        }

        let fCrmAddress = document.getElementById("filter-crm-adv-address")?.value.toLowerCase();
        if (fCrmAddress) {
          uiFilteredCustomers = uiFilteredCustomers.filter(
            (kh) => (kh.DiaChi || "").toLowerCase().includes(fCrmAddress)
          );
        }
`;

if (regexFilterLogic.test(html)) {
    html = html.replace(regexFilterLogic, newFilterLogic);
} else {
    console.log("Not found regex for filtering logic CRM.");
}

const fnAdditions = `
      function toggleCrmAdvancedSearch() {
        const adv = document.getElementById('crm-advanced-search');
        if (adv.style.display === 'none' || adv.style.display === '') {
            adv.style.display = 'block';
        } else {
            adv.style.display = 'none';
        }
      }

      function syncCrmSearchMain() {
        document.getElementById('filter-crm-adv-search').value = document.getElementById('filter-crm-search-main').value;
      }

      function syncCrmSearchAdv() {
        document.getElementById('filter-crm-search-main').value = document.getElementById('filter-crm-adv-search').value;
      }

      function executeCrmSearch() {
        renderTables();
        document.getElementById('crm-advanced-search').style.display = 'none';
      }

      // Close advanced search if clicked outside
      document.addEventListener('click', function(e) {
          let container = document.getElementById('crm-search-container');
          let adv = document.getElementById('crm-advanced-search');
          if (container && adv && adv.style.display === 'block') {
              if (!container.contains(e.target)) {
                  adv.style.display = 'none';
              }
          }
      });
`;

html = html.replace('function initSystem() {', fnAdditions + '\n      function initSystem() {');

// We also need to fix clearFilters to include our fields and clean up
html = html.replace(/document\.getElementById\("filter-crm-search"\)\.value = "";/, 
    `document.getElementById("filter-crm-search-main").value = "";
          document.getElementById("filter-crm-adv-search").value = "";
          document.getElementById("filter-crm-adv-email").value = "";
          document.getElementById("filter-crm-adv-address").value = "";`);
          
html = html.replace(/document\.getElementById\("filter-crm-address"\)\.value = "";/, "");
html = html.replace(/document\.getElementById\("filter-crm-type"\)\.value = "";/, "");


fs.writeFileSync('index.html', html);
