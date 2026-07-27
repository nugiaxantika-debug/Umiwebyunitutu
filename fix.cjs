const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// Fix the sed mess
code = code.replace(/if \(ownerCommands\.includes\(requestedCmd\).*?!isOwner\)\s*\{\s*if\s*\(this\.ownerNumbers\.size === 0 && \(requestedCmd === "\.addowner" \|\| requestedCmd === "addowner"\)\)\s*\{\}\s*else\s*\{/s, 
`if (ownerCommands.includes(requestedCmd) && !isOwner) {
      if (this.ownerNumbers.size === 0 && (requestedCmd === ".addowner" || requestedCmd === "addowner")) {
          // Allow
      } else {`);

// Also fix the extra closing bracket
code = code.replace(/return await this\.sock\.sendMessage\(jid, \{ text: \`👑 \*Akses Ditolak\*\nPerintah ini hanya bisa digunakan oleh Owner!\` \}, \{ quoted: msg \}\); \}/g,
`return await this.sock.sendMessage(jid, { text: \`👑 *Akses Ditolak*\nPerintah ini hanya bisa digunakan oleh Owner!\` }, { quoted: msg });
      }`);

fs.writeFileSync('src/services/whatsapp.ts', code);
