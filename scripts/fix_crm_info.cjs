const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regexGrid = /<!-- Grid Info -->[\s\S]*?<!-- Footer Buttons -->/;

let newGrid = `<!-- Grid Info -->
                      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px; border-bottom:1px solid #f0f0f0; padding-bottom:20px;">
                          <div>
                              <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Điện thoại</div>
                              <div style="font-size:14px; color:\${kh.SDT ? 'var(--text-main)' : '#aaa'}; font-weight:500;">\${kh.SDT || 'Chưa có'}</div>
                          </div>
                          <div>
                              <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Sinh nhật</div>
                              <div style="font-size:14px; color:\${kh.SinhNhat ? 'var(--text-main)' : '#aaa'}; font-weight:500;">\${kh.SinhNhat || 'Chưa có'}</div>
                          </div>
                          <div>
                              <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Giới tính</div>
                              <div style="font-size:14px; color:\${kh.GioiTinh ? 'var(--text-main)' : '#aaa'}; font-weight:500;">\${kh.GioiTinh || 'Chưa có'}</div>
                          </div>
                          
                          <div>
                              <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Email</div>
                              <div style="font-size:14px; color:\${kh.Email ? 'var(--text-main)' : '#aaa'}; font-weight:500;">\${kh.Email || 'Chưa có'}</div>
                          </div>
                          <div>
                              <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Facebook</div>
                              <div style="font-size:14px; color:\${kh.Facebook ? 'var(--text-main)' : '#aaa'}; font-weight:500;">\${kh.Facebook || 'Chưa có'}</div>
                          </div>
                          <div></div>

                          <div style="grid-column: span 3;">
                              <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">Địa chỉ</div>
                              <div style="font-size:14px; color:\${kh.DiaChi ? 'var(--text-main)' : '#aaa'}; font-weight:500;">\${kh.DiaChi || 'Chưa có'}</div>
                          </div>
                      </div>

                      

                      <!-- Footer Buttons -->`;

html = html.replace(regexGrid, newGrid);
fs.writeFileSync('index.html', html);
console.log('Replaced grid');
