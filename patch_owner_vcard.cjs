const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const oldOwnerCommand = `    } else if (body === ".owner" || body === "owner") {
       const owners = Array.from(this.ownerNumbers);
       let text = "👑 *Pemilik Bot*\\n\\n";
       if (owners.length > 0) {
           owners.forEach((num, i) => text += \`\${i+1}. @\${num.split('@')[0]}\\n\`);
       } else {
           text += "Belum ada owner yang ditambahkan.\\n(Untuk menambahkan: .addowner @user)";
       }
       await this.sock.sendMessage(jid, { text, mentions: owners }, { quoted: msg });`;

const newOwnerCommand = `    } else if (body === ".owner" || body === "owner") {
       const owners = Array.from(this.ownerNumbers);
       if (owners.length > 0) {
           const contacts = [];
           for (const num of owners) {
               const number = num.split('@')[0];
               contacts.push({
                   vcard: \`BEGIN:VCARD\\nVERSION:3.0\\nFN:Owner Bot\\nTEL;type=CELL;type=VOICE;waid=\${number}:+\${number}\\nEND:VCARD\`
               });
           }
           await this.sock.sendMessage(jid, {
               contacts: {
                   displayName: 'Owner Bot',
                   contacts: contacts
               }
           }, { quoted: msg });
       } else {
           await this.sock.sendMessage(jid, { text: "Belum ada owner yang ditambahkan.\\n(Untuk menambahkan: .addowner @user)" }, { quoted: msg });
       }`;

if (code.includes('let text = "👑 *Pemilik Bot*\\n\\n";')) {
    code = code.replace(oldOwnerCommand, newOwnerCommand);
    fs.writeFileSync('src/services/whatsapp.ts', code);
    console.log("Patched .owner to send vcards");
} else {
    console.log("Could not find .owner command to patch");
}
