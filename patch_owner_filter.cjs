const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const regex = /contacts\.push\(\{\s*vcard: `BEGIN:VCARD\\nVERSION:3\.0\\nFN:Owner Bot\\nTEL;type=CELL;type=VOICE;waid=\$\{number\}:\+\$\{number\}\\nEND:VCARD`\s*\}\);/g;

code = code.replace(/for \(const num of owners\) \{/g, `for (const num of owners) {
               if (num.includes("@lid") || num.includes("@g.us")) continue;`);

fs.writeFileSync('src/services/whatsapp.ts', code);
console.log('Filtered lid from owner vcards');
