const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf-8');

const regex = /text \+= \`\$\{idx \+ 1\}\. 📞 \$\{nomor\}[^`]*\`;/g;
code = code.replace(regex, "text += `${idx + 1}. 📞 ${nomor}\\n   🆔 ${lid}\\n\\n`;");

fs.writeFileSync('src/services/whatsapp.ts', code);
