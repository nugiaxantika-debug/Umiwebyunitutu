const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// Ensure the LID is hardcoded in isOwner check
const regex = /const isOwner = msg\.key\.fromMe \|\| this\.ownerNumbers\.has\(senderJid\);/;
if (code.match(regex)) {
    code = code.replace(regex, `const isOwner = msg.key.fromMe || this.ownerNumbers.has(senderJid) || senderJid === "13937756098656@lid";`);
    console.log('Patched isOwner for LID');
}

// Ensure normalizeJid handles all cases
const normalizeRegex = /private normalizeJid\(jidStr: string\): string \{[\s\S]*?return numPart \+ "@s\.whatsapp\.net";\n  \}/;
const newNormalize = `private normalizeJid(jidStr: string): string {
    if (!jidStr) return "";
    let clean = jidStr.replace(/:\\d+/, "");
    
    if (clean.endsWith("@g.us")) {
        let groupNum = clean.split("@")[0];
        return groupNum + "@g.us";
    }

    if (clean.endsWith("@lid")) {
        let lidNum = clean.split("@")[0];
        return lidNum + "@lid";
    }

    let numPart = clean.replace(/[^0-9]/g, "");
    
    // Auto-convert 08... to 628...
    if (numPart.startsWith("0")) {
        numPart = "62" + numPart.slice(1);
    }
    
    return numPart + "@s.whatsapp.net";
  }`;
if (code.match(normalizeRegex)) {
    code = code.replace(normalizeRegex, newNormalize);
    console.log('Patched normalizeJid');
}

// Modify addowner response to explain LID if needed
const addownerRegex = /✅ Berhasil menambahkan \$\{targetJid\.split\('@'\)\[0\]\} sebagai owner baru!/;
if (code.match(addownerRegex)) {
    code = code.replace(addownerRegex, `✅ Berhasil menambahkan \${targetJid.split('@')[0]} sebagai owner baru!\n(Catatan: Pastikan menggunakan nomor yang benar. Jika akun menggunakan ID Anonymous/LID, harap gunakan tag .addowner @user)`);
    console.log('Patched addowner message');
}

fs.writeFileSync('src/services/whatsapp.ts', code);
