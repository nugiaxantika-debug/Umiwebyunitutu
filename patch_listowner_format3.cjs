const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf-8');

code = code.split("text += `${idx + 1}. 📞 ${nomor}   🆔 ${lid}`;").join("text += `${idx + 1}. 📞 ${nomor}\\n   🆔 ${lid}\\n\\n`;");

fs.writeFileSync('src/services/whatsapp.ts', code);
