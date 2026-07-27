const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const regex = /\} else if \(body\.startsWith\("\.addowner"\) \|\| body\.startsWith\("addowner"\)\) \{\n\s*if \(\!isOwner\) return await this\.sock\.sendMessage\(jid, \{ text: \`⚠️ Hanya owner yang dapat menggunakan fitur ini!\` \}, \{ quoted: msg \}\);/;
const replacement = `} else if (body.startsWith(".addowner") || body.startsWith("addowner")) {
      if (!isOwner && this.ownerNumbers.size > 0) return await this.sock.sendMessage(jid, { text: \`⚠️ Hanya owner yang dapat menggunakan fitur ini!\` }, { quoted: msg });`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/services/whatsapp.ts', code);
    console.log("Patched addowner to allow first owner");
} else {
    console.log("Regex not found");
}
