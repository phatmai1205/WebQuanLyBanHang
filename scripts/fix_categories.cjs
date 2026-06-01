const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const openStr = `document.getElementById("modal-masp").value = 'SP' + (maxId + 1);`;
const replaceOpen = `        let sel = document.getElementById("modal-maloaisp");
        sel.innerHTML = '';
        let cats = appData.SANPHAM.map(s => s.TenLoaiSP).filter((v, i, a) => v && a.indexOf(v) === i);
        cats.forEach(c => {
           let opt = document.createElement('option');
           opt.value = c;
           opt.text = c;
           sel.add(opt);
        });
        
        document.getElementById("modal-masp").value = 'SP' + (maxId + 1);`;

const editStr = `document.getElementById("modal-masp").value = sp.MaSP;`;
const replaceEdit = `        let sel = document.getElementById("modal-maloaisp");
        sel.innerHTML = '';
        let cats = appData.SANPHAM.map(s => s.TenLoaiSP).filter((v, i, a) => v && a.indexOf(v) === i);
        cats.forEach(c => {
           let opt = document.createElement('option');
           opt.value = c;
           opt.text = c;
           sel.add(opt);
        });
        
        document.getElementById("modal-masp").value = sp.MaSP;`;

html = html.replace(openStr, replaceOpen);
html = html.replace(editStr, replaceEdit);

fs.writeFileSync('index.html', html);
console.log('Categories population added');
