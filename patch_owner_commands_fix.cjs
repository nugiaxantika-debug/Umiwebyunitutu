const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// Also make sure .owner works and prints their JID to help them debug
const ownerRegex = /\} else if \(body === "\.owner" \|\| body === "owner"\) \{/;
if (code.match(ownerRegex)) {
    code = code.replace(ownerRegex, `} else if (body === ".owner" || body === "owner") {
      // Also send them their JID so they know what the bot sees
      await this.sock.sendMessage(jid, { text: \`🔍 Debug ID Anda: \${senderJid}\` });`);
    fs.writeFileSync('src/services/whatsapp.ts', code);
    console.log('Added debug JID to .owner');
}
