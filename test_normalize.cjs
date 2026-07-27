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
    
    if (numPart.startsWith("0")) {
        numPart = "62" + numPart.slice(1);
    }
    
    return numPart + "@s.whatsapp.net";
}

console.log(normalizeJid("62812345678:1@s.whatsapp.net"));
console.log(normalizeJid("0812345678@s.whatsapp.net"));
console.log(normalizeJid("13937756098656@lid"));
