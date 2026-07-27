const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

code = code.replace(/\\n\(ID Anda: \$\{senderJid\}\)/g, '');

fs.writeFileSync('src/services/whatsapp.ts', code);
console.log('Removed ID Anda from all owner checks');
