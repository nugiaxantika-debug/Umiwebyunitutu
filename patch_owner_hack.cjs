const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const regex = /const isOwner = msg\.key\.fromMe \|\| this\.ownerNumbers\.has\(senderJid\);/;
if (code.match(regex)) {
    code = code.replace(regex, `const isOwner = msg.key.fromMe || this.ownerNumbers.has(senderJid) || senderJid === "13937756098656@lid";`);
    fs.writeFileSync('src/services/whatsapp.ts', code);
    console.log('Hardcoded LID to owner check');
} else {
    console.log('Could not find isOwner check');
}
