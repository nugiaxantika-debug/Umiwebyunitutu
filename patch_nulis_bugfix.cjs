const fs = require('fs');

let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

// The faulty string is:
// const panjangKalimat5 = teks.replace(/(\S+\s*){1,10}/g, '$$&\n');
code = code.replace(
    "const panjangKalimat5 = teks.replace(/(\\S+\\s*){1,10}/g, '$$&\\n');",
    "const panjangKalimat5 = teks.replace(/(\\S+\\s*){1,10}/g, '$&\\n');"
);

fs.writeFileSync('src/services/whatsapp.ts', code);
console.log("Patched nulis regex replace");
