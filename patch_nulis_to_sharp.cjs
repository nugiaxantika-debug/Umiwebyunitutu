const fs = require('fs');

let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const nulisRegex = /\} else if \(body\.startsWith\("\.nulis "\)[\s\S]*?(?=\} else if \(body\.startsWith\("\.faktadunia"\))/;
const replacementNulis = `} else if (body.startsWith(".nulis ") || body === ".nulis" || body.startsWith("nulis ") || body === "nulis") {
       let teks = messageContent.replace(/^\\.?nulis\\s*/i, "").trim();
       if (!teks) {
         await this.sock.sendMessage(jid, { text: \`Kirim perintah .nulis [teks yang ingin ditulis]\` }, { quoted: msg });
       } else {
         await this.sock.sendMessage(jid, { text: \`⏳ *Sedang menulis...*\` }, { quoted: msg });
         try {
           const nulisDir = import_path.default ? import_path.default.join(process.cwd(), 'node_modules', 'nulis-buku') : path.join(process.cwd(), 'node_modules', 'nulis-buku');
           const bgPath = import_path.default ? import_path.default.join(nulisDir, 'assets', 'buku1.jpg') : path.join(nulisDir, 'assets', 'buku1.jpg');
           
           const now = new Date();
           const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][now.getDay()];
           const tanggal = \`\${now.getDate().toString().padStart(2, '0')}/\${(now.getMonth() + 1).toString().padStart(2, '0')}/\${now.getFullYear()}\`;
           
           const imgBuffer = fs.readFileSync(bgPath);
           const baseImageBuffer = await sharp(imgBuffer).jpeg().toBuffer();
           
           teks = teks.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
           const safeName = (msg.pushName || 'User').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
           
           const words = teks.split(' ');
           let lines = [];
           let currentLine = '';
           for (let word of words) {
               if ((currentLine + word).length > 30 && currentLine.length > 0) {
                   lines.push(currentLine);
                   currentLine = word + ' ';
               } else {
                   currentLine += word + ' ';
               }
           }
           if (currentLine) lines.push(currentLine);
           lines = lines.slice(0, 33);
           
           const tspans = lines.map((line, i) => \`<tspan x="344" dy="\${i === 0 ? 0 : '19'}">\${line.trim()}</tspan>\`).join('');
           
           const svgText = \`<svg width="1280" height="960" xmlns="http://www.w3.org/2000/svg">
             <text x="806" y="78" font-size="20" font-family="cursive, sans-serif" fill="#1b1b1b">\${hari}</text>
             <text x="806" y="102" font-size="18" font-family="cursive, sans-serif" fill="#1b1b1b">\${tanggal}</text>
             <text x="360" y="100" font-size="18" font-family="cursive, sans-serif" fill="#1b1b1b">\${safeName}</text>
             <text x="360" y="120" font-size="18" font-family="cursive, sans-serif" fill="#1b1b1b">-</text>
             <text x="344" y="142" font-size="20" font-family="cursive, sans-serif" fill="#1b1b1b">
               \${tspans}
             </text>
           </svg>\`;
           
           const finalBuffer = await sharp(baseImageBuffer)
              .composite([{ input: Buffer.from(svgText), blend: 'over' }])
              .jpeg().toBuffer();
              
           await this.sock.sendMessage(jid, { image: finalBuffer, caption: \`📝 *Nulis Selesai*\` }, { quoted: msg });
         } catch (e: any) {
           await this.sock.sendMessage(jid, { text: \`❌ *Gagal menulis:* \${e.message}\` }, { quoted: msg });
         }
       }
    `;
code = code.replace(nulisRegex, replacementNulis);

fs.writeFileSync('src/services/whatsapp.ts', code);
console.log("Patched nulis with sharp and SVG");
