const fs = require('fs');

let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// I need to find where the bad injection started, but since it's messed up, I should probably just restore from git or replace the whole broken section.
