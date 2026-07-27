const fs = require('fs');

let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// Replace .tostiker handler
const tostikerRegex = /\} else if \(body\.startsWith\("\.tostiker"\) \|\| body\.startsWith\("tostiker"\)\) \{[\s\S]*?(?=\} else if \(body\.startsWith\("\.rvo"\) \|\| body\.startsWith\("rvo"\)\) \{)/g;

const newTostiker = `} else if (body.startsWith(".tostiker") || body.startsWith("tostiker")) {
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
               
               const tempInput = path.join(os.tmpdir(), \`vid_\${Date.now()}.mp4\`);
               const tempOutput = path.join(os.tmpdir(), \`vid_\${Date.now()}.webp\`);
               fs.writeFileSync(tempInput, buffer);
               
               execFileSync(ffmpegPath, [
                   '-y',
                   '-i', tempInput,
                   '-vcodec', 'libwebp',
                   '-vf', 'scale=\\'min(512,iw)\\':min\\'(512,ih)\\':force_original_aspect_ratio=decrease,fps=12,pad=512:512:-1:-1:color=white@0.0,format=rgba',
                   '-lossless', '0',
                   '-compression_level', '6',
                   '-q:v', '50',
                   '-loop', '0',
                   '-preset', 'picture',
                   '-an',
                   '-vsync', '0',
                   tempOutput
               ]);
               
               const stickerBuffer = fs.readFileSync(tempOutput);
               
               // Try to add Exif
               let finalStickerBuffer = stickerBuffer;
               try {
                   const webpmux = require('node-webpmux');
                   const img = new webpmux.Image();
                   await img.load(stickerBuffer);
                   const exif = Buffer.from(JSON.stringify({
                       "sticker-pack-id": "1",
                       "sticker-pack-name": "Stiker Video",
                       "sticker-pack-publisher": "Bot",
                       "emojis": ["🤖"]
                   }), 'utf8');
                   const exifBuf = Buffer.concat([Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]), exif]);
                   exifBuf.writeUInt32LE(exif.length, 14);
                   img.exif = exifBuf;
                   finalStickerBuffer = await img.save(null);
               } catch(err) {
                   console.error("Exif error:", err);
               }
               
               await this.sock.sendMessage(jid, { sticker: finalStickerBuffer }, { quoted: msg });
               try { fs.unlinkSync(tempInput); fs.unlinkSync(tempOutput); } catch(e){}
           } catch (e: any) {
               console.error("tostiker error:", e);
               await this.sock.sendMessage(jid, { text: \`❌ Gagal memproses video! Error: \${e.message}\` }, { quoted: msg });
           }
       } else {
           await this.sock.sendMessage(jid, { text: "Kirim atau balas video dengan perintah ini!" }, { quoted: msg });
       }
    `;

code = code.replace(tostikerRegex, newTostiker);

// Also patch .stiker to handle video
const stikerRegex = /\} else if \(body\.startsWith\("\.stiker"\) \|\| body\.startsWith\("stiker"\) \|\| body\.startsWith\("\.hd"\) \|\| body\.startsWith\("hd"\)\) \{[\s\S]*?(?=\} else if \(body\.startsWith\("\.culikswgc"\) \|\| body\.startsWith\("culikswgc"\)\) \{)/g;

const newStiker = `} else if (body.startsWith(".stiker") || body.startsWith("stiker") || body.startsWith(".hd") || body.startsWith("hd")) {
      const type = body.includes("hd") ? "HD" : "Stiker";
      
      const isQuotedImage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
      const isQuotedVideo = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;
      const isImage = msg.message?.imageMessage;
      const isVideo = msg.message?.videoMessage;
      const mediaMessage = isQuotedImage
         ? { message: { imageMessage: isQuotedImage } }
         : isQuotedVideo
           ? { message: { videoMessage: isQuotedVideo } }
           : (isImage || isVideo ? msg : null);

      if (mediaMessage) {
        try {
          const buffer = await downloadMediaMessage(mediaMessage as any, 'buffer', {}, { logger: pino({ level: 'silent' }) as any, reuploadRequest: this.sock.updateMediaMessage }) as Buffer;
          if (type === "Stiker") {
              const isVid = !!(isQuotedVideo || isVideo);
              if (isVid) {
                   await this.sock.sendMessage(jid, { text: "⏳ *Sedang memproses video menjadi stiker...*" }, { quoted: msg });
                   const tempInput = path.join(os.tmpdir(), \`vid_\${Date.now()}.mp4\`);
                   const tempOutput = path.join(os.tmpdir(), \`vid_\${Date.now()}.webp\`);
                   fs.writeFileSync(tempInput, buffer);
                   
                   execFileSync(ffmpegPath, [
                       '-y',
                       '-i', tempInput,
                       '-vcodec', 'libwebp',
                       '-vf', 'scale=\\'min(512,iw)\\':min\\'(512,ih)\\':force_original_aspect_ratio=decrease,fps=12,pad=512:512:-1:-1:color=white@0.0,format=rgba',
                       '-lossless', '0',
                       '-compression_level', '6',
                       '-q:v', '50',
                       '-loop', '0',
                       '-preset', 'picture',
                       '-an',
                       '-vsync', '0',
                       tempOutput
                   ]);
                   
                   const stickerBuffer = fs.readFileSync(tempOutput);
                   let finalStickerBuffer = stickerBuffer;
                   try {
                       const webpmux = require('node-webpmux');
                       const img = new webpmux.Image();
                       await img.load(stickerBuffer);
                       const exif = Buffer.from(JSON.stringify({ "sticker-pack-id": "1", "sticker-pack-name": "Stiker Video", "sticker-pack-publisher": "Bot", "emojis": ["🤖"] }), 'utf8');
                       const exifBuf = Buffer.concat([Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]), exif]);
                       exifBuf.writeUInt32LE(exif.length, 14);
                       img.exif = exifBuf;
                       finalStickerBuffer = await img.save(null);
                   } catch(err) {}
                   
                   await this.sock.sendMessage(jid, { sticker: finalStickerBuffer }, { quoted: msg });
                   try { fs.unlinkSync(tempInput); fs.unlinkSync(tempOutput); } catch(e){}
              } else {
                  const stickerBuffer = await sharp(buffer).resize(512, 512, { fit: 'contain', background: { r:0, g:0, b:0, alpha:0 } }).webp({ quality: 80 }).toBuffer();
                  await this.sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });
              }
          } else {
              const hdBuffer = await sharp(buffer).resize({ width: 2000, withoutEnlargement: false }).sharpen({ sigma: 1, m1: 2, m2: 0 }).jpeg({ quality: 100 }).toBuffer();
              await this.sock.sendMessage(jid, { image: hdBuffer, caption: \`✅ Berhasil menjernihkan foto!\` }, { quoted: msg });
          }
        } catch (e: any) {
          console.error("Stiker error:", e);
          await this.sock.sendMessage(jid, { text: \`❌ Gagal memproses media! Error: \${e.message}\` }, { quoted: msg });
        }
      } else {
        await this.sock.sendMessage(jid, { text: \`Kirim atau balas gambar/video dengan caption \${body.split(" ")[0]} untuk menggunakan fitur \${type}.\` }, { quoted: msg });
      }
    `;

code = code.replace(stikerRegex, newStiker);

fs.writeFileSync('src/services/whatsapp.ts', code);
console.log("Patched successfully");
