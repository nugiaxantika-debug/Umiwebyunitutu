const fs = require('fs');
let code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');

if (code.includes("require('@napi-rs/canvas')") || code.includes("require('node-webpmux')")) {
    console.log("FAIL: require still exists");
} else {
    console.log("SUCCESS: require is gone");
}
