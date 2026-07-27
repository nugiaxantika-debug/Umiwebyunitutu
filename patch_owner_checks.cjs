const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// Patch broadcast
const broadcastRegex = /\} else if \(body\.startsWith\("\.broadcast"\) \|\| body\.startsWith\("broadcast"\)\) \{/;
if (code.match(broadcastRegex)) {
    code = code.replace(broadcastRegex, `} else if (body.startsWith(".broadcast") || body.startsWith("broadcast")) {\n      if (!isOwner) return await this.sock.sendMessage(jid, { text: \`👑 *Akses Ditolak*\\nPerintah ini hanya bisa digunakan oleh Owner!\` }, { quoted: msg });`);
    console.log('Patched broadcast');
}

// Patch restartbot
const restartbotRegex = /\} else if \(body === "\.restartbot" \|\| body === "restartbot"\) \{/;
if (code.match(restartbotRegex)) {
    code = code.replace(restartbotRegex, `} else if (body === ".restartbot" || body === "restartbot") {\n      if (!isOwner) return await this.sock.sendMessage(jid, { text: \`👑 *Akses Ditolak*\\nPerintah ini hanya bisa digunakan oleh Owner!\` }, { quoted: msg });`);
    console.log('Patched restartbot');
}

// Ensure ownermenu is patched (just in case I missed any variation)
const ownermenuRegex = /\} else if \(body === "ownermenu" \|\| body === "\.ownermenu" \|\| body === "owner menu" \|\| body === "\.owner menu"\) \{\n\s*const ownerText/;
if (code.match(ownermenuRegex)) {
    code = code.replace(ownermenuRegex, `} else if (body === "ownermenu" || body === ".ownermenu" || body === "owner menu" || body === ".owner menu") {\n      if (!isOwner) return await this.sock.sendMessage(jid, { text: \`👑 *Akses Ditolak*\\nPerintah ini hanya bisa digunakan oleh Owner!\` }, { quoted: msg });\n      const ownerText`);
    console.log('Patched ownermenu again');
}

fs.writeFileSync('src/services/whatsapp.ts', code);
