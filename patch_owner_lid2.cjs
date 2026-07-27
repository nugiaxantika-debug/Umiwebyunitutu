const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf-8');

code = code.replace(
/owners\.forEach\(\(owner, idx\) => \{[\s\S]*?\}\);/g,
`for (let idx = 0; idx < owners.length; idx++) {
           const owner = owners[idx];
           let nomor = owner.includes("@lid") ? "Menunggu interaksi" : "+" + owner.split('@')[0];
           let lid = owner.includes("@lid") ? owner.split('@')[0] : "Menunggu interaksi";
           if (!owner.includes("@lid")) {
               try {
                   if (this.sock?.signalRepository?.lidMapping?.getLIDForPN) {
                       const mappedLid = await this.sock.signalRepository.lidMapping.getLIDForPN(owner);
                       if (mappedLid) lid = mappedLid.split('@')[0];
                   }
               } catch(e) {}
           }
           text += \`\${idx + 1}. 📞 \${nomor}\n   🆔 \${lid}\n\n\`;
        }`
);

fs.writeFileSync('src/services/whatsapp.ts', code);
