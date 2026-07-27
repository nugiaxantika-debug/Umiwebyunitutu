const fs = require('fs');
const code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const regex = /\} else if \(body\.startsWith\("\.restartbot"\)[\s\S]*?(?=\} else if)/;
const match = code.match(regex);
console.log(match ? match[0] : 'not found');
