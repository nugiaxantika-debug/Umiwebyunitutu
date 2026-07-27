const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// Find where senderJid is defined
const match = code.match(/const senderJid = [^\n]+/);
console.log(match ? match[0] : "Not found");
