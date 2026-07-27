const sharp = require('sharp');
const fs = require('fs');

async function test() {
    const lines = ["Brat", "Summer", "Text", "Wrapped"];
    const tspans = lines.map((line, i) => `<tspan x="50%" dy="${i === 0 ? 0 : '1.2em'}">${line}</tspan>`).join('');
    
    // adjust initial y based on number of lines to center it
    const startY = 50 - (lines.length * 10 / 2);
    
    const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      <text x="50%" y="${startY}%" font-size="60" font-family="sans-serif" font-weight="bold" fill="black" text-anchor="middle" dominant-baseline="middle">
        ${tspans}
      </text>
    </svg>`;
    
    try {
        const buffer = await sharp(Buffer.from(svg)).webp().toBuffer();
        fs.writeFileSync('test-sharp-svg-wrap.webp', buffer);
        console.log("Success SVG Wrap");
    } catch (e) {
        console.error(e);
    }
}
test();
