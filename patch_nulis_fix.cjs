const fs = require('fs');

let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const regex = /\} else if \(body\.startsWith\("\.nulis "\)[\s\S]*?(?=\} else if \(body\.startsWith\("\.faktadunia"\) \|\| body\.startsWith\("faktadunia"\)\) \{)/g;

const replacement = `} else if (body.startsWith(".nulis ") || body === ".nulis" || body.startsWith("nulis ") || body === "nulis") {
       const teks = messageContent.replace(/^\\.?nulis\\s*/i, "").trim();
       if (!teks) {
         await this.sock.sendMessage(jid, { text: \`Kirim perintah .nulis [teks yang ingin ditulis]\` }, { quoted: msg });
       } else {
         await this.sock.sendMessage(jid, { text: \`⏳ *Sedang menulis...*\` }, { quoted: msg });
         try {
           const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
           const nulisDir = path.join(process.cwd(), 'node_modules', 'nulis-buku');
           const bgPath = path.join(nulisDir, 'assets', 'buku1.jpg');
           const fontPath = path.join(nulisDir, 'font', 'Indie-Flower.ttf');
           
           GlobalFonts.registerFromPath(fontPath, 'Indie Flower');
           
           const image = await loadImage(bgPath);
           const canvas = createCanvas(image.width, image.height);
           const ctx = canvas.getContext('2d');
           
           ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
           
           ctx.fillStyle = '#1b1b1b';
           ctx.textBaseline = 'alphabetic';
           
           const now = new Date();
           const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][now.getDay()];
           const tanggal = \`\${now.getDate().toString().padStart(2, '0')}/\${(now.getMonth() + 1).toString().padStart(2, '0')}/\${now.getFullYear()}\`;
           
           ctx.font = '20px "Indie Flower"';
           ctx.fillText(hari, 806, 78);
           
           ctx.font = '18px "Indie Flower"';
           ctx.fillText(tanggal, 806, 102);
           
           ctx.fillText(msg.pushName || 'User', 360, 100);
           ctx.fillText('-', 360, 120);
           
           ctx.font = '20px "Indie Flower"';
           const panjangKalimat5 = teks.replace(/(\\S+\\s*){1,10}/g, '$$&\\n');
           const lines = panjangKalimat5.split('\\n').slice(0, 33);
           
           let startY = 142;
           const lineHeight = 19; 
           
           for (let i = 0; i < lines.length; i++) {
               ctx.fillText(lines[i], 344, startY + (i * lineHeight));
           }
           
           const buffer = canvas.toBuffer('image/jpeg');
           await this.sock.sendMessage(jid, { image: buffer, caption: \`📝 *Nulis Selesai*\` }, { quoted: msg });
         } catch (e: any) {
           await this.sock.sendMessage(jid, { text: \`❌ *Gagal menulis:* \${e.message}\` }, { quoted: msg });
         }
       }
    `;

if (code.match(regex)) {
    code = code.replace(regex, () => replacement);
    fs.writeFileSync('src/services/whatsapp.ts', code);
    console.log("Patched nulis fix");
} else {
    console.log("Regex not found");
}
