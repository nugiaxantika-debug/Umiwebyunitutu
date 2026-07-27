const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// We will replace the isOwner check to be more lenient.
const isOwnerRegex = /const isOwner = msg\.key\.fromMe \|\| this\.ownerNumbers\.has\(senderJid\);/;
const lenientIsOwner = `const senderNum = senderJid.split('@')[0];
    const isOwner = msg.key.fromMe || this.ownerNumbers.has(senderJid) || Array.from(this.ownerNumbers).some(o => o.startsWith(senderNum + "@") || senderJid.startsWith(o.split('@')[0] + "@"));`;

if (code.match(isOwnerRegex)) {
    code = code.replace(isOwnerRegex, lenientIsOwner);
    console.log("Patched isOwner");
} else {
    console.log("isOwnerRegex not found");
}

fs.writeFileSync('src/services/whatsapp.ts', code);
