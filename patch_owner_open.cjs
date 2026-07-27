const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const regex = /const ownerCommands = \['\.antibot'.*\];/;
const match = code.match(regex);
if (match) {
    let arr = match[0];
    arr = arr.replace(/, '\.ownermenu', 'ownermenu'/, '');
    arr = arr.replace(/, '\.owner', 'owner'/, '');
    code = code.replace(regex, arr);
    fs.writeFileSync('src/services/whatsapp.ts', code);
    console.log('Opened .owner and .ownermenu');
} else {
    console.log('Could not find ownerCommands');
}
