const sharp = require('sharp');
const fs = require('fs');

async function test() {
    // Read some TTF font and convert to base64
    const fontBuffer = fs.readFileSync('node_modules/nulis-buku/font/Indie-Flower.ttf');
    const fontBase64 = fontBuffer.toString('base64');
    
    const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @font-face {
            font-family: "Indie Flower";
            src: url("data:font/ttf;base64,${fontBase64}");
          }
        </style>
      </defs>
      <rect width="100%" height="100%" fill="white"/>
      <text x="50%" y="50%" font-size="80" font-family="Indie Flower, sans-serif" font-weight="bold" fill="black" text-anchor="middle" dominant-baseline="middle">Testing Font</text>
    </svg>`;
    
    try {
        const buffer = await sharp(Buffer.from(svg)).webp().toBuffer();
        fs.writeFileSync('test-sharp-font.webp', buffer);
        console.log("Success font");
    } catch (e) {
        console.error(e);
    }
}
test();
