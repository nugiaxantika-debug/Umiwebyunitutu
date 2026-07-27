const sharp = require('sharp');
const fs = require('fs');

async function test() {
    const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <text x="50%" y="50%" font-size="256" text-anchor="middle" dominant-baseline="middle">😭</text>
    </svg>`;
    try {
        const buffer = await sharp(Buffer.from(svg)).webp().toBuffer();
        fs.writeFileSync('test-sharp-emoji.webp', buffer);
        console.log("Success emoji");
    } catch (e) {
        console.error(e);
    }
}
test();
