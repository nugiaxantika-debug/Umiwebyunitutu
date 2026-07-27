const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const regex = /const senderJid = typeof senderJidRaw === 'string' \? this\.normalizeJid\(senderJidRaw\) : senderJidRaw;/;
console.log(code.match(regex) ? "Found normalization" : "Not found");
