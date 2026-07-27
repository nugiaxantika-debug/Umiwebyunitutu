const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// I will add a command to check the participant / sender JID properties
const regex = /\} else if \(body === "\.owner" \|\| body === "owner"\) \{/;
if (code.match(regex)) {
    code = code.replace(regex, `} else if (body === ".owner" || body === "owner") {\n      await this.sock.sendMessage(jid, { text: \`🔍 Debug JID:\\nsenderJid: \${senderJid}\\nparticipant: \${msg.key.participant}\\nremoteJid: \${msg.key.remoteJid}\` });`);
    fs.writeFileSync('src/services/whatsapp.ts', code);
    console.log("Patched .owner to show JIDs");
}
