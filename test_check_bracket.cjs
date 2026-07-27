const fs = require('fs');
const code = fs.readFileSync('src/services/whatsapp.ts', 'utf8');
const { parse } = require('@babel/parser');
try {
  parse(code, { plugins: ['typescript'], sourceType: 'module' });
  console.log("No syntax errors.");
} catch (e) {
  console.error("Syntax error:", e.message);
}
