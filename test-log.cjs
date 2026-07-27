const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

code = code.replace(/console\.error\("Brat error:", e\);/g, `console.error("Brat error:", e); require('fs').appendFileSync('bot-errors.log', "Brat: " + e.stack + '\\n');`);
code = code.replace(/console\.error\("Smeme error: ", e\);/g, `console.error("Smeme error: ", e); require('fs').appendFileSync('bot-errors.log', "Smeme: " + e.stack + '\\n');`);
code = code.replace(/console\.error\("Bratgambar error:", e\);/g, `console.error("Bratgambar error:", e); require('fs').appendFileSync('bot-errors.log', "Bratgambar: " + e.stack + '\\n');`);
code = code.replace(/console\.error\("ATTP error: ", e\);/g, `console.error("ATTP error: ", e); require('fs').appendFileSync('bot-errors.log', "ATTP: " + e.stack + '\\n');`);
code = code.replace(/console\.error\("Logo error: ", e\);/g, `console.error("Logo error: ", e); require('fs').appendFileSync('bot-errors.log', "Logo: " + e.stack + '\\n');`);
// also emojigif
code = code.replace(/await this\.sock\.sendMessage\(jid, \{ text: \`❌ Gagal membuat emojigif\.\` \}, \{ quoted: msg \}\);/g, `require('fs').appendFileSync('bot-errors.log', "Emojigif: " + (e.stack || e) + '\\n'); await this.sock.sendMessage(jid, { text: \`❌ Gagal membuat emojigif.\` }, { quoted: msg });`);

fs.writeFileSync('src/services/whatsapp.ts', code);
