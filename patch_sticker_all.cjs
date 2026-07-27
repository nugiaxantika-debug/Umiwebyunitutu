const fs = require('fs');

let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// Replace bratvid and brat
const bratRegex = /\} else if \(body\.startsWith\("\.bratvid "\)[\s\S]*?(?=\} else if \(\/^\.?\(stkbaik)/;

const replacementBrat = `} else if (body.startsWith(".bratvid ") || body === ".bratvid" || body.startsWith("bratvid ") || body === "bratvid") {
       await this.sock.sendMessage(jid, { text: \`Fitur bratvid sementara dinonaktifkan.\` }, { quoted: msg });
    } else if (body.startsWith(".brat ") || body === ".brat" || body.startsWith("brat ") || body === "brat") {
       const text = messageContent.replace(/^\\.?brat\\s*/i, "").trim() || "Brat";
       try {
           await this.sock.sendMessage(jid, { text: "⏳ *Membuat stiker brat...*" }, { quoted: msg });
           const { createCanvas } = require('@napi-rs/canvas');
           const canvas = createCanvas(512, 512);
           const ctx = canvas.getContext('2d');
           
           ctx.fillStyle = 'white';
           ctx.fillRect(0, 0, 512, 512);
           
           ctx.fillStyle = 'black';
           ctx.font = 'bold 80px Arial';
           ctx.textAlign = 'center';
           ctx.textBaseline = 'middle';
           
           const words = text.split(' ');
           let lines = [];
           let currentLine = '';
           
           for (let word of words) {
               let testLine = currentLine + word + ' ';
               if (ctx.measureText(testLine).width > 480 && currentLine.length > 0) {
                   lines.push(currentLine);
                   currentLine = word + ' ';
               } else {
                   currentLine = testLine;
               }
           }
           lines.push(currentLine);
           
           const lineHeight = 90;
           const totalHeight = lines.length * lineHeight;
           let startY = (512 - totalHeight) / 2 + (lineHeight / 2);
           
           for (let line of lines) {
               ctx.fillText(line.trim(), 256, startY);
               startY += lineHeight;
           }
           
           const buffer = canvas.toBuffer('image/png');
           const stickerBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
           await this.sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });
       } catch (e) {
           console.error("Brat error:", e);
           await this.sock.sendMessage(jid, { text: \`❌ Gagal membuat stiker brat.\` }, { quoted: msg });
       }
    `;
code = code.replace(bratRegex, replacementBrat);

// Replace smeme
const smemeRegex = /\} else if \(body\.startsWith\("\.smeme"\)[\s\S]*?(?=\} else if \(body\.startsWith\("\.qc"\))/;
const replacementSmeme = `} else if (body.startsWith(".smeme") || body.startsWith("smeme")) {
       const text = messageContent.replace(/^\\.?smeme\\s*/i, "").trim();
       if (!text || !text.includes("|")) {
          await this.sock.sendMessage(jid, { text: \`Kirim teks dengan format atas|bawah!\\nContoh: .smeme Halo|Semua\` }, { quoted: msg });
       } else {
          try {
             await this.sock.sendMessage(jid, { text: "⏳ *Sedang membuat smeme...*" }, { quoted: msg });
             const [atas, bawah] = text.split("|");
             
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
             
             const { createCanvas, loadImage } = require('@napi-rs/canvas');
             const image = await loadImage(bgBuffer);
             const canvas = createCanvas(512, 512);
             const ctx = canvas.getContext('2d');
             
             ctx.drawImage(image, 0, 0, 512, 512);
             
             ctx.font = 'bold 60px Arial';
             ctx.textAlign = 'center';
             ctx.fillStyle = 'white';
             ctx.strokeStyle = 'black';
             ctx.lineWidth = 6;
             
             if (atas.trim()) {
                 ctx.textBaseline = 'top';
                 ctx.strokeText(atas.trim(), 256, 15);
                 ctx.fillText(atas.trim(), 256, 15);
             }
             
             if (bawah.trim()) {
                 ctx.textBaseline = 'bottom';
                 ctx.strokeText(bawah.trim(), 256, 497);
                 ctx.fillText(bawah.trim(), 256, 497);
             }
             
             const finalBuffer = canvas.toBuffer('image/png');
             const stickerBuffer = await sharp(finalBuffer).webp({ quality: 80 }).toBuffer();
             await this.sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });
          } catch (e) {
             console.error("Smeme error: ", e);
             await this.sock.sendMessage(jid, { text: \`❌ Gagal membuat stiker meme.\` }, { quoted: msg });
          }
       }
    `;
code = code.replace(smemeRegex, replacementSmeme);

// Replace bratgambar
const bratgambarRegex = /\} else if \(body\.startsWith\("\.bratgambar"\)[\s\S]*?(?=\} else if \(body\.startsWith\("\.stikerrandom"\))/;
const replacementBratgambar = `} else if (body.startsWith(".bratgambar") || body.startsWith("bratgambar")) {
       const text = messageContent.replace(/^\\.?bratgambar\\s*/i, "").trim() || "Brat";
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
               
               const { createCanvas, loadImage } = require('@napi-rs/canvas');
               const image = await loadImage(baseImageBuffer);
               const canvas = createCanvas(512, 512);
               const ctx = canvas.getContext('2d');
               
               ctx.drawImage(image, 0, 0, 512, 512);
               
               // semi transparent white overlay
               ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
               ctx.fillRect(0, 0, 512, 512);
               
               ctx.fillStyle = 'black';
               ctx.font = 'bold 80px Arial';
               ctx.textAlign = 'center';
               ctx.textBaseline = 'middle';
               
               const words = text.split(' ');
               let lines = [];
               let currentLine = '';
               
               for (let word of words) {
                   let testLine = currentLine + word + ' ';
                   if (ctx.measureText(testLine).width > 480 && currentLine.length > 0) {
                       lines.push(currentLine);
                       currentLine = word + ' ';
                   } else {
                       currentLine = testLine;
                   }
               }
               lines.push(currentLine);
               
               const lineHeight = 90;
               const totalHeight = lines.length * lineHeight;
               let startY = (512 - totalHeight) / 2 + (lineHeight / 2);
               
               for (let line of lines) {
                   ctx.fillText(line.trim(), 256, startY);
                   startY += lineHeight;
               }
               
               const finalBuffer = canvas.toBuffer('image/png');
               const stickerBuffer = await sharp(finalBuffer).webp({ quality: 80 }).toBuffer();
                                  
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

// Replace ATTP
const attpRegex = /\} else if \(body\.startsWith\("\.attp"\)[\s\S]*?(?=\} else if \(body\.startsWith\("\.logo"\))/;
const replacementAttp = `} else if (body.startsWith(".attp") || body.startsWith("attp")) {
       const { Sticker } = await import('wa-sticker-formatter');
       const text = messageContent.replace(/^\\.?attp\\s*/i, "").trim();
       if (!text) {
          await this.sock.sendMessage(jid, { text: \`Kirim teks untuk dibuat stiker attp!\\nContoh: .attp Halo\` }, { quoted: msg });
       } else {
          try {
             await this.sock.sendMessage(jid, { text: \`⏳ *Sedang membuat stiker ATTP...*\` }, { quoted: msg });
             const url = \`https://api.vreden.my.id/api/maker/attp?text=\${encodeURIComponent(text)}\`;
             let stickerData = null;
             try {
                const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 5000 });
                stickerData = Buffer.from(res.data);
             } catch (err) {
                 // Fallback to canvas rendering
                 const { createCanvas } = require('@napi-rs/canvas');
                 const canvas = createCanvas(512, 512);
                 const ctx = canvas.getContext('2d');
                 
                 ctx.fillStyle = 'transparent';
                 ctx.fillRect(0, 0, 512, 512);
                 
                 const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'];
                 const randomColor = colors[Math.floor(Math.random() * colors.length)];
                 
                 ctx.fillStyle = randomColor;
                 ctx.strokeStyle = 'white';
                 ctx.lineWidth = 8;
                 ctx.font = 'bold 80px Arial';
                 ctx.textAlign = 'center';
                 ctx.textBaseline = 'middle';
                 
                 // basic word wrap
                 const words = text.split(' ');
                 let lines = [];
                 let currentLine = '';
                 
                 for (let word of words) {
                     let testLine = currentLine + word + ' ';
                     if (ctx.measureText(testLine).width > 480 && currentLine.length > 0) {
                         lines.push(currentLine);
                         currentLine = word + ' ';
                     } else {
                         currentLine = testLine;
                     }
                 }
                 lines.push(currentLine);
                 
                 const lineHeight = 90;
                 const totalHeight = lines.length * lineHeight;
                 let startY = (512 - totalHeight) / 2 + (lineHeight / 2);
                 
                 for (let line of lines) {
                     ctx.strokeText(line.trim(), 256, startY);
                     ctx.fillText(line.trim(), 256, startY);
                     startY += lineHeight;
                 }
                 
                 const pngBuffer = canvas.toBuffer('image/png');
                 const sticker = new Sticker(pngBuffer, { pack: 'ATTP', author: 'Bot', type: 'full' });
                 stickerData = await sticker.toBuffer();
             }
             await this.sock.sendMessage(jid, { sticker: stickerData }, { quoted: msg });
          } catch (e) {
             console.error("ATTP error: ", e);
             await this.sock.sendMessage(jid, { text: \`❌ Gagal membuat ATTP.\` }, { quoted: msg });
          }
       }
    `;
code = code.replace(attpRegex, replacementAttp);

// Replace logo
const logoRegex = /\} else if \(body\.startsWith\("\.logo"\)[\s\S]*?(?=\} else if \(body\.startsWith\("\.wallpaper"\))/;
const replacementLogo = `} else if (body.startsWith(".logo") || body.startsWith("logo")) {
       const text = messageContent.replace(/^\\.?logo\\s*/i, "").trim();
       if (!text) {
          await this.sock.sendMessage(jid, { text: \`Kirim teks untuk dibuat logo!\\nContoh: .logo Keren\` }, { quoted: msg });
       } else {
          try {
             await this.sock.sendMessage(jid, { text: \`⏳ *Sedang membuat logo...*\` }, { quoted: msg });
             
             const { createCanvas } = require('@napi-rs/canvas');
             const canvas = createCanvas(800, 800);
             const ctx = canvas.getContext('2d');
             
             // Create linear gradient
             const grad = ctx.createLinearGradient(0, 0, 800, 800);
             grad.addColorStop(0, "rgb(131,58,180)");
             grad.addColorStop(0.5, "rgb(253,29,29)");
             grad.addColorStop(1, "rgb(252,176,69)");
             
             ctx.fillStyle = grad;
             ctx.fillRect(0, 0, 800, 800);
             
             ctx.fillStyle = 'white';
             ctx.strokeStyle = 'black';
             ctx.lineWidth = 10;
             ctx.font = 'bold 100px Arial';
             ctx.textAlign = 'center';
             ctx.textBaseline = 'middle';
             
             // basic word wrap
             const words = text.split(' ');
             let lines = [];
             let currentLine = '';
             
             for (let word of words) {
                 let testLine = currentLine + word + ' ';
                 if (ctx.measureText(testLine).width > 750 && currentLine.length > 0) {
                     lines.push(currentLine);
                     currentLine = word + ' ';
                 } else {
                     currentLine = testLine;
                 }
             }
             lines.push(currentLine);
             
             const lineHeight = 110;
             const totalHeight = lines.length * lineHeight;
             let startY = (800 - totalHeight) / 2 + (lineHeight / 2);
             
             for (let line of lines) {
                 ctx.strokeText(line.trim(), 400, startY);
                 ctx.fillText(line.trim(), 400, startY);
                 startY += lineHeight;
             }
             
             const finalBuffer = canvas.toBuffer('image/jpeg');
             await this.sock.sendMessage(jid, { image: finalBuffer, caption: \`🎨 *Logo berhasil dibuat!*\` }, { quoted: msg });
          } catch (e) {
             console.error("Logo error: ", e);
             await this.sock.sendMessage(jid, { text: \`❌ Gagal membuat logo.\` }, { quoted: msg });
          }
       }
    `;
code = code.replace(logoRegex, replacementLogo);

// Replace emojigif
const emojiRegex = /\} else if \(body\.startsWith\("\.emojigif"\)[\s\S]*?(?=\} else if \(body\.startsWith\("\.bratgambar"\))/;
const replacementEmoji = `} else if (body.startsWith(".emojigif") || body.startsWith("emojigif")) {
       const text = messageContent.replace(/^\\.?emojigif\\s*/i, "").trim();
       const chars = Array.from(text.replace(/[\\s+]/g, '')) as string[];
       const emojis = chars.filter(c => (c.codePointAt(0) || 0) > 255);
       if (emojis.length >= 1) {
           try {
               await this.sock.sendMessage(jid, { text: "⏳ *Membuat emoji...*" }, { quoted: msg });
               const { createCanvas } = require('@napi-rs/canvas');
               const canvas = createCanvas(512, 512);
               const ctx = canvas.getContext('2d');
               
               ctx.fillStyle = 'transparent';
               ctx.fillRect(0, 0, 512, 512);
               
               ctx.font = '256px Arial';
               ctx.textAlign = 'center';
               ctx.textBaseline = 'middle';
               
               ctx.fillText(emojis[0], 256, 256);
               
               const frame1 = canvas.toBuffer('image/png');
               const stickerBuffer = await sharp(frame1).webp({ quality: 80 }).toBuffer();
               
               await this.sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });
           } catch (e) {
               await this.sock.sendMessage(jid, { text: \`❌ Gagal membuat emojigif.\` }, { quoted: msg });
           }
       } else {
           await this.sock.sendMessage(jid, { text: \`Kirim satu emoji!\\nContoh: .emojigif 😭\` }, { quoted: msg });
       }
    `;
code = code.replace(emojiRegex, replacementEmoji);

fs.writeFileSync('src/services/whatsapp.ts', code);
console.log("Patched all features successfully");
