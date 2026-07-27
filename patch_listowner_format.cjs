const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf-8');

code = code.replace(
/text \+= \`\$\{idx \+ 1\}\. 📞 \$\{nomor\}   🆔 \$\{lid\}\`;/g,
"text += `${idx + 1}. 📞 ${nomor}\\n   🆔 ${lid}\\n\\n`;"
);

fs.writeFileSync('src/services/whatsapp.ts', code);
