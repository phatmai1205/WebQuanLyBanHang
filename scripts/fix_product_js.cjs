const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const jsInjection = `      function toggleNewCategoryInput() {
        const wrap = document.getElementById('category-input-wrapper');
        const selWrap = document.getElementById('category-select-wrapper');
        if (wrap.style.display === 'none') {
            wrap.style.display = 'flex';
            selWrap.style.display = 'none';
        } else {
            wrap.style.display = 'none';
            selWrap.style.display = 'block';
        }
      }

      function saveNewCategory() {
        const val = document.getElementById('modal-new-category').value.trim();
        if (!val) return;
        
        let categories = appData.SANPHAM.map(sp => sp.TenLoaiSP).filter((v, i, a) => v && a.indexOf(v) === i);
        if (!categories.includes(val)) {
            // We just add it to select, since real category is bound to product loosely.
            const sel = document.getElementById('modal-maloaisp');
            const opt = document.createElement('option');
            opt.value = val;
            opt.text = val;
            sel.add(opt);
            sel.value = val;
        } else {
            document.getElementById('modal-maloaisp').value = val;
        }
        
        document.getElementById('modal-new-category').value = '';
        toggleNewCategoryInput();
      }

      function handleProductImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.size > 2 * 1024 * 1024) {
            return showToast("File ảnh không được vượt quá 2MB", true);
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result;
            document.getElementById('modal-hinh-anh').value = base64;
            
            document.getElementById('image-placeholder').style.display = 'none';
            const img = document.getElementById('image-preview');
            img.src = base64;
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }

      function openProductModal() {`;

html = html.replace('function openProductModal() {', jsInjection);

const editProductRegex = /function editProduct\(maSP\) {[\s\S]*?document\.getElementById\("product-modal"\)\.classList\.add\("show"\);\s*}/;
const newEditProduct = `function editProduct(maSP) {
        const sp = appData.SANPHAM.find((x) => x.MaSP === maSP);
        if (!sp) return;
        document.getElementById("product-modal-title").innerText =
          "Chỉnh Sửa Sản Phẩm";
        document.getElementById("modal-masp").value = sp.MaSP;
        document.getElementById("modal-masp").disabled = true;
        document.getElementById("modal-tensp").value = sp.TenSP;
        document.getElementById("modal-maloaisp").value = sp.TenLoaiSP;
        document.getElementById("modal-dongiasp").value = sp.DonGia;
        document.getElementById("modal-tonkhosp").value = sp.TonKho;
        document.getElementById("modal-hinh-anh").value = sp.HinhAnh || "";
        document.getElementById("modal-iseditsp").value = "1";
        
        const img = document.getElementById('image-preview');
        const placeholder = document.getElementById('image-placeholder');
        if (sp.HinhAnh) {
             img.src = sp.HinhAnh;
             img.style.display = 'block';
             placeholder.style.display = 'none';
        } else {
             img.src = '';
             img.style.display = 'none';
             placeholder.style.display = 'block';
        }

        document.getElementById("product-modal").classList.add("show");
      }`;

html = html.replace(editProductRegex, newEditProduct);

const openProductRegex = /function openProductModal\(\) {[\s\S]*?document\.getElementById\("product-modal"\)\.classList\.add\("show"\);\s*}/;
const newOpenProduct = `function openProductModal() {
        document.getElementById("product-modal-title").innerText =
          "Thêm Sản Phẩm Mới";
        // Cấp mã tự động
        let maxId = 0;
        appData.SANPHAM.forEach(sp => {
           if (sp.MaSP.startsWith('SP')) {
              let idStr = sp.MaSP.substring(2);
              if (!isNaN(idStr)) {
                 if (parseInt(idStr) > maxId) maxId = parseInt(idStr);
              }
           }
        });
        document.getElementById("modal-masp").value = 'SP' + (maxId + 1);
        document.getElementById("modal-masp").disabled = false;
        document.getElementById("modal-tensp").value = "";
        document.getElementById("modal-dongiasp").value = 0;
        document.getElementById("modal-tonkhosp").value = 0;
        document.getElementById("modal-hinh-anh").value = "";
        document.getElementById("modal-iseditsp").value = "0";
        
        document.getElementById('image-preview').style.display = 'none';
        document.getElementById('image-preview').src = '';
        document.getElementById('image-placeholder').style.display = 'block';
        document.getElementById('modal-image-upload').value = '';

        document.getElementById("product-modal").classList.add("show");
      }`;

html = html.replace(openProductRegex, newOpenProduct);


const submitSearch = `        if (isEdit) {
          const sp = appData.SANPHAM.find((x) => x.MaSP === m);
          if (sp) {
            sp.TenSP = t;
            sp.TenLoaiSP = document.getElementById("modal-maloaisp").value;
            sp.DonGia = g;
            sp.TonKho = k;
          }
        } else {
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
          appData.SANPHAM.push({
            MaSP: m,
            TenSP: t,
            TenLoaiSP: document.getElementById("modal-maloaisp").value,
            DonGia: g,
            TonKho: k,
            HinhAnh: hinhAnhBase64
          });
        }`;

html = html.replace(submitSearch, submitReplace);

fs.writeFileSync('index.html', html);
console.log('JS injected');
