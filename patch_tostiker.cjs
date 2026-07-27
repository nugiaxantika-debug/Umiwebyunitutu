const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const newCode = `
    } else if (body.startsWith(".tostiker") || body.startsWith("tostiker")) {
       const isQuotedVideo = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;
       const isVideo = msg.message?.videoMessage;
       const videoMessage = isQuotedVideo ? { message: { videoMessage: isQuotedVideo } } : isVideo ? msg : null;
       if (videoMessage) {
           try {
               await this.sock.sendMessage(jid, { text: "⏳ *Sedang memproses video...*" }, { quoted: msg });
               const buffer = await downloadMediaMessage(
                   videoMessage as any,
                   'buffer',
                   {},
                   { logger: pino({ level: 'silent' }) as any, reuploadRequest: this.sock.updateMediaMessage }
               ) as Buffer;
               const { Sticker } = await import('wa-sticker-formatter');
               const sticker = new Sticker(buffer, { pack: 'Tostiker', author: 'Bot', type: 'full', quality: 50 });
               const stickerBuffer = await sticker.toBuffer();
               await this.sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });
           } catch (e: any) {
               console.error("tostiker error:", e);
               await this.sock.sendMessage(jid, { text: \`❌ Gagal memproses video! Error: \${e.message}\` }, { quoted: msg });
           }
       } else {
           await this.sock.sendMessage(jid, { text: "Kirim atau balas video dengan perintah ini!" }, { quoted: msg });
       }`;

code = code.replace(/    } else if \(body\.startsWith\("\.rvo"\) \|\| body\.startsWith\("rvo"\)\) \{/, newCode + '\n    } else if (body.startsWith(".rvo") || body.startsWith("rvo")) {');
fs.writeFileSync('src/services/whatsapp.ts', code);
console.log('patched successfully');
