const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf-8');

code = code.replace(
/let nomor = targetJid.includes\("@lid"\) \? "Menunggu interaksi" : "\+" \+ targetJid\.split\('@'\)\[0\];\s*let lid = targetJid.includes\("@lid"\) \? targetJid\.split\('@'\)\[0\] : "Menunggu interaksi";/g,
`let nomor = targetJid.includes("@lid") ? "Menunggu interaksi" : "+" + targetJid.split('@')[0];
        let lid = targetJid.includes("@lid") ? targetJid.split('@')[0] : "Menunggu interaksi";
        if (!targetJid.includes("@lid")) {
            try {
                if (this.sock?.signalRepository?.lidMapping?.getLIDForPN) {
                    const mappedLid = await this.sock.signalRepository.lidMapping.getLIDForPN(targetJid);
                    if (mappedLid) lid = mappedLid.split('@')[0];
                }
            } catch(e) {}
        }`
);

code = code.replace(
/let nomor = foundJid.includes\("@lid"\) \? "Menunggu interaksi" : "\+" \+ foundJid\.split\('@'\)\[0\];\s*let lid = foundJid.includes\("@lid"\) \? foundJid\.split\('@'\)\[0\] : "Menunggu interaksi";/g,
`let nomor = foundJid.includes("@lid") ? "Menunggu interaksi" : "+" + foundJid.split('@')[0];
            let lid = foundJid.includes("@lid") ? foundJid.split('@')[0] : "Menunggu interaksi";
            if (!foundJid.includes("@lid")) {
                try {
                    if (this.sock?.signalRepository?.lidMapping?.getLIDForPN) {
                        const mappedLid = await this.sock.signalRepository.lidMapping.getLIDForPN(foundJid);
                        if (mappedLid) lid = mappedLid.split('@')[0];
                    }
                } catch(e) {}
            }`
);

code = code.replace(
/let nomor = owner.includes\("@lid"\) \? "Menunggu interaksi" : "\+" \+ owner\.split\('@'\)\[0\];\s*let lid = owner.includes\("@lid"\) \? owner\.split\('@'\)\[0\] : "Menunggu interaksi";/g,
`let nomor = owner.includes("@lid") ? "Menunggu interaksi" : "+" + owner.split('@')[0];
           let lid = owner.includes("@lid") ? owner.split('@')[0] : "Menunggu interaksi";
           // Note: Cannot easily await inside forEach, we'll just show what we have.
           // However, if we change forEach to a normal loop, we can await it.
`
);

fs.writeFileSync('src/services/whatsapp.ts', code);
