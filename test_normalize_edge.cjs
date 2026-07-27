const fs = require('fs');

function normalizeJid(jidStr) {
    if (!jidStr) return "";
    let clean = jidStr.replace(/:\d+/, "");
    
    if (clean.endsWith("@g.us")) {
        let groupNum = clean.split("@")[0];
        return groupNum + "@g.us";
    }

    if (clean.endsWith("@lid")) {
        let lidNum = clean.split("@")[0];
        return lidNum + "@lid";
    }

    let numPart = clean.replace(/[^0-9]/g, "");
    
    // Auto-convert 08... to 628...
    if (numPart.startsWith("0")) {
        numPart = "62" + numPart.slice(1);
    }
    
    return numPart + "@s.whatsapp.net";
}

console.log(normalizeJid("62812345678@s.whatsapp.net")); // direct
console.log(normalizeJid("0812345678@s.whatsapp.net")); // 0 to 62
console.log(normalizeJid("+62 812-345-678@s.whatsapp.net")); // formatting
console.log(normalizeJid("62812345678:15@s.whatsapp.net")); // device id
