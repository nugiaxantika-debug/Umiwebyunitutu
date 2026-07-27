const fs = require('fs');
const code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const regex = /\} else if \(body\.startsWith\("\.addowner"\)[\s\S]*?\} else if \(body\.startsWith\("\.listowner"\)/;
const match = code.match(regex);
console.log(match ? match[0] : 'not found');
