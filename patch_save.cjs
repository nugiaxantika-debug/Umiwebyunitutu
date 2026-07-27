const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const regex = /fs\.writeFileSync\(this\.botSettingsFile, JSON\.stringify\(obj, null, 2\)\);/;
if (code.match(regex)) {
    code = code.replace(regex, `console.log("Saving bot settings to:", this.botSettingsFile);\n    fs.writeFileSync(this.botSettingsFile, JSON.stringify(obj, null, 2));`);
    fs.writeFileSync('src/services/whatsapp.ts', code);
    console.log("Patched saveBotSettings");
}
