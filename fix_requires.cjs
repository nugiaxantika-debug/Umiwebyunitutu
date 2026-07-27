const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// Replace injected errors
code = code.replace(/console\.error\("Brat error:", e\); require\('fs'\)\.appendFileSync\('bot-errors\.log', "Brat: " \+ e\.stack \+ '\\n'\);/g, `console.error("Brat error:", e);`);
code = code.replace(/console\.error\("Smeme error: ", e\); require\('fs'\)\.appendFileSync\('bot-errors\.log', "Smeme: " \+ e\.stack \+ '\\n'\);/g, `console.error("Smeme error: ", e);`);
code = code.replace(/console\.error\("Bratgambar error:", e\); require\('fs'\)\.appendFileSync\('bot-errors\.log', "Bratgambar: " \+ e\.stack \+ '\\n'\);/g, `console.error("Bratgambar error:", e);`);
code = code.replace(/console\.error\("ATTP error: ", e\); require\('fs'\)\.appendFileSync\('bot-errors\.log', "ATTP: " \+ e\.stack \+ '\\n'\);/g, `console.error("ATTP error: ", e);`);
code = code.replace(/console\.error\("Logo error: ", e\); require\('fs'\)\.appendFileSync\('bot-errors\.log', "Logo: " \+ e\.stack \+ '\\n'\);/g, `console.error("Logo error: ", e);`);
code = code.replace(/require\('fs'\)\.appendFileSync\('bot-errors\.log', "Emojigif: " \+ \(e\.stack \|\| e\) \+ '\\n'\); await this\.sock\.sendMessage\(jid, \{ text: \`❌ Gagal membuat emojigif\.\` \}, \{ quoted: msg \}\);/g, `await this.sock.sendMessage(jid, { text: \`❌ Gagal membuat emojigif.\` }, { quoted: msg });`);

// Replace require
code = code.replace(/require\('@napi-rs\/canvas'\)/g, `(await import('@napi-rs/canvas'))`);
code = code.replace(/require\('node-webpmux'\)/g, `(await import('node-webpmux')).default`);

fs.writeFileSync('src/services/whatsapp.ts', code);
console.log("Replaced requires with await import");
