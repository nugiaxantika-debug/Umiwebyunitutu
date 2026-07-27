const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const isOwnerRegex = /const senderNum = senderJid\.split\('@'\)\[0\];\n\s*const isOwner = msg\.key\.fromMe \|\| this\.ownerNumbers\.has\(senderJid\) \|\| Array\.from\(this\.ownerNumbers\)\.some\(o => o\.startsWith\(senderNum \+ "@"\) \|\| senderJid\.startsWith\(o\.split\('@'\)\[0\] \+ "@"\)\);/;

const lenientIsOwner = `const senderNum = senderJid.split('@')[0];
    const isOwner = msg.key.fromMe || this.ownerNumbers.has(senderJid) || Array.from(this.ownerNumbers).some(o => {
        const oNum = o.split('@')[0];
        if (oNum === senderNum) return true;
        // Check if last 10 digits match (to handle country code issues like 0 vs 62 vs +234)
        if (oNum.length >= 10 && senderNum.length >= 10) {
            return oNum.slice(-10) === senderNum.slice(-10);
        }
        return false;
    });`;

if (code.match(isOwnerRegex)) {
    code = code.replace(isOwnerRegex, lenientIsOwner);
    console.log("Patched isOwner v2");
} else {
    console.log("isOwnerRegex not found");
}

fs.writeFileSync('src/services/whatsapp.ts', code);
