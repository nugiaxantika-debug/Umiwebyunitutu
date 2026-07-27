const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

const target = `    }
    
    if (premiumCommands.includes(requestedCmd) && !isPremium) {`;

code = code.replace(target, `    }
    }
    
    if (premiumCommands.includes(requestedCmd) && !isPremium) {`);

fs.writeFileSync('src/services/whatsapp.ts', code);
