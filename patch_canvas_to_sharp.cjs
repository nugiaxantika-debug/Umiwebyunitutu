const fs = require('fs');

let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// Helper to escape text for SVG
function escapeSvg(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// 1. .bratvid / .brat
const bratRegex = /\} else if \(body\.startsWith\("\.bratvid "\)[\s\S]*?(?=\} else if \(body\.startsWith\("\.smeme"\) \|\| body\.startsWith\("smeme"\)\))/;
const replacementBrat = `} else if (body.startsWith(".bratvid ") || body === ".bratvid" || body.startsWith("bratvid ") || body === "bratvid") {
       await this.sock.sendMessage(jid, { text: \`Fitur bratvid sementara dinonaktifkan.\` }, { quoted: msg });
    } else if (body.startsWith(".brat ") || body === ".brat" || body.startsWith("brat ") || body === "brat") {
       let text = messageContent.replace(/^\\.?brat\\s*/i, "").trim() || "Brat";
       text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
       try {
           await this.sock.sendMessage(jid, { text: "⏳ *Membuat stiker brat...*" }, { quoted: msg });
           
           const words = text.split(' ');
           let lines = [];
           let currentLine = '';
           
           for (let word of words) {
               if ((currentLine + word).length > 15 && currentLine.length > 0) {
                   lines.push(currentLine);
                   currentLine = word + ' ';
               } else {
                   currentLine += word + ' ';
               }
           }
           if (currentLine) lines.push(currentLine);
           
           const tspans = lines.map((line, i) => \`<tspan x="50%" dy="\${i === 0 ? 0 : '1.2em'}">\${line.trim()}</tspan>\`).join('');
           const startY = 50 - ((lines.length - 1) * 6); // simple centering approximation
           
           const svg = \`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
             <rect width="100%" height="100%" fill="white"/>
             <text x="50%" y="\${startY}%" font-size="60" font-family="sans-serif" font-weight="bold" fill="black" text-anchor="middle" dominant-baseline="middle">
               \${tspans}
             </text>
           </svg>\`;
           
           const stickerBuffer = await sharp(Buffer.from(svg)).webp({ quality: 80 }).toBuffer();
           await this.sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });
       } catch (e) {
           console.error("Brat error:", e);
           await this.sock.sendMessage(jid, { text: \`❌ Gagal membuat stiker brat.\` }, { quoted: msg });
       }
    `;
code = code.replace(bratRegex, replacementBrat);

// 2. .smeme
const smemeRegex = /\} else if \(body\.startsWith\("\.smeme"\)[\s\S]*?(?=\} else if \(body\.startsWith\("\.qc"\))/;
const replacementSmeme = `} else if (body.startsWith(".smeme") || body.startsWith("smeme")) {
       const text = messageContent.replace(/^\\.?smeme\\s*/i, "").trim();
       if (!text || !text.includes("|")) {
          await this.sock.sendMessage(jid, { text: \`Kirim teks dengan format atas|bawah!\\nContoh: .smeme Halo|Semua\` }, { quoted: msg });
       } else {
          try {
             await this.sock.sendMessage(jid, { text: "⏳ *Sedang membuat smeme...*" }, { quoted: msg });
             let [atas, bawah] = text.split("|");
             atas = atas.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
             bawah = bawah.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
             
             const isMedia = msg.message?.imageMessage;
             const isQuotedMedia = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
             let bgBuffer = null;
             
             if (isMedia || isQuotedMedia) {
                const mediaMessage = isQuotedMedia ? { message: { imageMessage: isQuotedMedia } } : msg;
                const stream = await downloadMediaMessage(
                    mediaMessage as any,
                    'buffer',
                    {},
                    { logger: pino({ level: 'silent' }) as any, reuploadRequest: this.sock.updateMediaMessage }
                ) as Buffer;
                bgBuffer = await sharp(stream).resize(512, 512, { fit: 'cover' }).jpeg().toBuffer();
             } else {
                bgBuffer = await sharp({ create: { width: 512, height: 512, channels: 4, background: { r: 50, g: 50, b: 50, alpha: 1 } } }).jpeg().toBuffer();
             }
             
             const svgMeme = \`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
                <text x="256" y="50" font-size="60" font-family="sans-serif" font-weight="bold" fill="white" stroke="black" stroke-width="3" text-anchor="middle" dominant-baseline="hanging">\${atas}</text>
                <text x="256" y="462" font-size="60" font-family="sans-serif" font-weight="bold" fill="white" stroke="black" stroke-width="3" text-anchor="middle" dominant-baseline="alphabetic">\${bawah}</text>
             </svg>\`;
             
             const stickerBuffer = await sharp(bgBuffer)
                .composite([{ input: Buffer.from(svgMeme), blend: 'over' }])
                .webp({ quality: 80 }).toBuffer();
             
             await this.sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });
          } catch (e) {
             console.error("Smeme error: ", e);
             await this.sock.sendMessage(jid, { text: \`❌ Gagal membuat stiker meme.\` }, { quoted: msg });
          }
       }
    `;
code = code.replace(smemeRegex, replacementSmeme);

// 3. .bratgambar
const bratgambarRegex = /\} else if \(body\.startsWith\("\.bratgambar"\)[\s\S]*?(?=\} else if \(body\.startsWith\("\.stikerrandom"\))/;
const replacementBratgambar = `} else if (body.startsWith(".bratgambar") || body.startsWith("bratgambar")) {
       let text = messageContent.replace(/^\\.?bratgambar\\s*/i, "").trim() || "Brat";
       text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
       
       const isQuotedImage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
       const isImage = msg.message?.imageMessage;
       if (isQuotedImage || isImage) {
           try {
               await this.sock.sendMessage(jid, { text: "⏳ *Membuat stiker brat gambar...*" }, { quoted: msg });
               const mediaMessage = isQuotedImage ? { message: { imageMessage: isQuotedImage } } : msg;
               const imgBuffer = await downloadMediaMessage(
                   mediaMessage as any,
                   'buffer',
                   {},
                   { logger: pino({ level: 'silent' }) as any, reuploadRequest: this.sock.updateMediaMessage }
               ) as Buffer;
               
               const baseImageBuffer = await sharp(imgBuffer).resize(512, 512, { fit: 'cover' }).jpeg().toBuffer();
               
               const words = text.split(' ');
               let lines = [];
               let currentLine = '';
               
               for (let word of words) {
                   if ((currentLine + word).length > 15 && currentLine.length > 0) {
                       lines.push(currentLine);
                       currentLine = word + ' ';
                   } else {
                       currentLine += word + ' ';
                   }
               }
               if (currentLine) lines.push(currentLine);
               
               const tspans = lines.map((line, i) => \`<tspan x="50%" dy="\${i === 0 ? 0 : '1.2em'}">\${line.trim()}</tspan>\`).join('');
               const startY = 50 - ((lines.length - 1) * 6);
               
               const svgText = \`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
                 <rect width="100%" height="100%" fill="rgba(255, 255, 255, 0.5)"/>
                 <text x="50%" y="\${startY}%" font-size="60" font-family="sans-serif" font-weight="bold" fill="black" text-anchor="middle" dominant-baseline="middle">
                   \${tspans}
                 </text>
               </svg>\`;
               
               const stickerBuffer = await sharp(baseImageBuffer)
                  .composite([{ input: Buffer.from(svgText), blend: 'over' }])
                  .webp({ quality: 80 }).toBuffer();
                                  
               await this.sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });
           } catch (e) {
               console.error("Bratgambar error:", e);
               await this.sock.sendMessage(jid, { text: \`❌ Gagal membuat stiker brat gambar.\` }, { quoted: msg });
           }
       } else {
           await this.sock.sendMessage(jid, { text: \`Reply/kirim gambar dengan perintah .bratgambar <teks>\` }, { quoted: msg });
       }
    `;
code = code.replace(bratgambarRegex, replacementBratgambar);

// 4. .attp
const attpRegex = /\} else if \(body\.startsWith\("\.attp"\)[\s\S]*?(?=\} else if \(body\.startsWith\("\.logo"\))/;
const replacementAttp = `} else if (body.startsWith(".attp") || body.startsWith("attp")) {
       const { Sticker } = await import('wa-sticker-formatter');
       let text = messageContent.replace(/^\\.?attp\\s*/i, "").trim();
       if (!text) {
          await this.sock.sendMessage(jid, { text: \`Kirim teks untuk dibuat stiker attp!\\nContoh: .attp Halo\` }, { quoted: msg });
       } else {
          try {
             await this.sock.sendMessage(jid, { text: \`⏳ *Sedang membuat stiker ATTP...*\` }, { quoted: msg });
             text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
             
             const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'];
             const randomColor = colors[Math.floor(Math.random() * colors.length)];
             
             const words = text.split(' ');
             let lines = [];
             let currentLine = '';
             for (let word of words) {
                 if ((currentLine + word).length > 12 && currentLine.length > 0) {
                     lines.push(currentLine);
                     currentLine = word + ' ';
                 } else {
                     currentLine += word + ' ';
                 }
             }
             if (currentLine) lines.push(currentLine);
             
             const tspans = lines.map((line, i) => \`<tspan x="50%" dy="\${i === 0 ? 0 : '1.2em'}">\${line.trim()}</tspan>\`).join('');
             const startY = 50 - ((lines.length - 1) * 8);
             
             const svgATTP = \`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
               <rect width="100%" height="100%" fill="transparent"/>
               <text x="50%" y="\${startY}%" font-size="80" font-family="sans-serif" font-weight="bold" fill="\${randomColor}" stroke="white" stroke-width="4" text-anchor="middle" dominant-baseline="middle">
                 \${tspans}
               </text>
             </svg>\`;
             
             const pngBuffer = await sharp(Buffer.from(svgATTP)).png().toBuffer();
             const sticker = new Sticker(pngBuffer, { pack: 'ATTP', author: 'Bot', type: 'full' });
             const stickerData = await sticker.toBuffer();
             
             await this.sock.sendMessage(jid, { sticker: stickerData }, { quoted: msg });
          } catch (e) {
             console.error("ATTP error: ", e);
             await this.sock.sendMessage(jid, { text: \`❌ Gagal membuat ATTP.\` }, { quoted: msg });
          }
       }
    `;
code = code.replace(attpRegex, replacementAttp);

// 5. .logo
const logoRegex = /\} else if \(body\.startsWith\("\.logo"\)[\s\S]*?(?=\} else if \(body\.startsWith\("\.wallpaper"\))/;
const replacementLogo = `} else if (body.startsWith(".logo") || body.startsWith("logo")) {
       let text = messageContent.replace(/^\\.?logo\\s*/i, "").trim();
       if (!text) {
          await this.sock.sendMessage(jid, { text: \`Kirim teks untuk dibuat logo!\\nContoh: .logo Keren\` }, { quoted: msg });
       } else {
          try {
             await this.sock.sendMessage(jid, { text: \`⏳ *Sedang membuat logo...*\` }, { quoted: msg });
             text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
             
             const words = text.split(' ');
             let lines = [];
             let currentLine = '';
             for (let word of words) {
                 if ((currentLine + word).length > 15 && currentLine.length > 0) {
                     lines.push(currentLine);
                     currentLine = word + ' ';
                 } else {
                     currentLine += word + ' ';
                 }
             }
             if (currentLine) lines.push(currentLine);
             
             const tspans = lines.map((line, i) => \`<tspan x="50%" dy="\${i === 0 ? 0 : '1.2em'}">\${line.trim()}</tspan>\`).join('');
             const startY = 50 - ((lines.length - 1) * 6);
             
             const svgLogo = \`<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
               <defs>
                 <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" style="stop-color:rgb(131,58,180);stop-opacity:1" />
                   <stop offset="50%" style="stop-color:rgb(253,29,29);stop-opacity:1" />
                   <stop offset="100%" style="stop-color:rgb(252,176,69);stop-opacity:1" />
                 </linearGradient>
               </defs>
               <rect width="100%" height="100%" fill="url(#grad1)"/>
               <text x="50%" y="\${startY}%" font-size="100" font-family="sans-serif" font-weight="bold" fill="white" stroke="black" stroke-width="4" text-anchor="middle" dominant-baseline="middle">
                 \${tspans}
               </text>
             </svg>\`;
             
             const finalBuffer = await sharp(Buffer.from(svgLogo)).jpeg().toBuffer();
             await this.sock.sendMessage(jid, { image: finalBuffer, caption: \`🎨 *Logo berhasil dibuat!*\` }, { quoted: msg });
          } catch (e) {
             console.error("Logo error: ", e);
             await this.sock.sendMessage(jid, { text: \`❌ Gagal membuat logo.\` }, { quoted: msg });
          }
       }
    `;
code = code.replace(logoRegex, replacementLogo);

// 6. .emojigif
const emojiRegex = /\} else if \(body\.startsWith\("\.emojigif"\)[\s\S]*?(?=\} else if \(body\.startsWith\("\.bratgambar"\))/;
const replacementEmoji = `} else if (body.startsWith(".emojigif") || body.startsWith("emojigif")) {
       const text = messageContent.replace(/^\\.?emojigif\\s*/i, "").trim();
       const chars = Array.from(text.replace(/[\\s+]/g, '')) as string[];
       const emojis = chars.filter(c => (c.codePointAt(0) || 0) > 255);
       if (emojis.length >= 1) {
           try {
               await this.sock.sendMessage(jid, { text: "⏳ *Membuat emoji...*" }, { quoted: msg });
               const codePoint = emojis[0].codePointAt(0)?.toString(16);
               let stickerBuffer = null;
               
               if (codePoint) {
                   const emojiUrl = \`https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/\${codePoint}.png\`;
                   try {
                       const emojiRes = await axios.get(emojiUrl, { responseType: 'arraybuffer' });
                       stickerBuffer = await sharp(emojiRes.data).resize(512, 512, { fit: 'contain' }).webp({ quality: 80 }).toBuffer();
                   } catch (err) {
                       // fallback to text if image not found
                       const svg = \`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
                          <text x="50%" y="50%" font-size="256" text-anchor="middle" dominant-baseline="middle">\${emojis[0]}</text>
                       </svg>\`;
                       stickerBuffer = await sharp(Buffer.from(svg)).webp({ quality: 80 }).toBuffer();
                   }
               }
               
               if (stickerBuffer) {
                   await this.sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });
               } else {
                   throw new Error("Buffer is null");
               }
           } catch (e) {
               console.error("Emojigif error:", e);
               await this.sock.sendMessage(jid, { text: \`❌ Gagal membuat emojigif.\` }, { quoted: msg });
           }
       } else {
           await this.sock.sendMessage(jid, { text: \`Kirim satu emoji!\\nContoh: .emojigif 😭\` }, { quoted: msg });
       }
    `;
code = code.replace(emojiRegex, replacementEmoji);

fs.writeFileSync('src/services/whatsapp.ts', code);
console.log("Patched all with sharp and SVG");
