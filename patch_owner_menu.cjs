const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// Ensure that .addowner works when empty
console.log("Checking if .addowner is open for 0 owners...");

