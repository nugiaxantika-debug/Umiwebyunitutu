const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const regex = /\} else if \(body === "ownermenu" \|\| body === "\.ownermenu" \|\| body === "owner menu" \|\| body === "\.owner menu"\) \{/;
const replacement = `} else if (body === "ownermenu" || body === ".ownermenu" || body === "owner menu" || body === ".owner menu") {
      if (!isOwner) return await this.sock.sendMessage(jid, { text: \`👑 *Akses Ditolak*\nPerintah ini hanya bisa digunakan oleh Owner!\` }, { quoted: msg });`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/services/whatsapp.ts', code);
    console.log('Added isOwner check to ownermenu');
} else {
    console.log('Could not find ownermenu block');
}
