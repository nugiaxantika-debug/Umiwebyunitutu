const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const regex = /if \(ownerCommands\.includes\(requestedCmd\) && \!isOwner\) \{\n\s*this\.broadcastState\(\`Blocked non-owner from using \$\{requestedCmd\}\`\);\n\s*return await this\.sock\.sendMessage\(jid, \{ text: \`👑 \*Akses Ditolak\*\nPerintah ini hanya bisa digunakan oleh Owner\!\` \}, \{ quoted: msg \}\);\n\s*\}/;

const replacement = `if (ownerCommands.includes(requestedCmd) && !isOwner) {
      if (this.ownerNumbers.size === 0 && (requestedCmd === '.addowner' || requestedCmd === 'addowner')) {
          // Allow the very first user to add an owner if the list is empty
      } else {
          this.broadcastState(\`Blocked non-owner from using \${requestedCmd}\`);
          return await this.sock.sendMessage(jid, { text: \`👑 *Akses Ditolak*\nPerintah ini hanya bisa digunakan oleh Owner!\` }, { quoted: msg });
      }
    }`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/services/whatsapp.ts', code);
    console.log("Patched owner check");
} else {
    console.log("Regex not found");
}
