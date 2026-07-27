const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const regex = /if \(this\.ownerNumbers\.has\(targetJid\)\) \{\n\s*this\.ownerNumbers\.delete\(targetJid\);/g;
const replacement = `let foundJid = targetJid;
        let exists = this.ownerNumbers.has(targetJid);
        if (!exists) {
            const targetNum = targetJid.split('@')[0];
            const match = Array.from(this.ownerNumbers).find(o => {
                const oNum = o.split('@')[0];
                return (oNum.length >= 10 && targetNum.length >= 10 && oNum.slice(-10) === targetNum.slice(-10));
            });
            if (match) {
                exists = true;
                foundJid = match;
            }
        }
        
        if (exists) {
            this.ownerNumbers.delete(foundJid);`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    console.log("Patched delowner");
} else {
    console.log("Not found");
}

fs.writeFileSync('src/services/whatsapp.ts', code);
