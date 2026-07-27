const sharp = require('sharp');
const fs = require('fs');

async function test() {
    const bgBuffer = await sharp({ create: { width: 512, height: 512, channels: 4, background: '#333' } }).png().toBuffer();
    const svgMeme = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
       <text x="256" y="50" font-size="60" font-family="Impact, sans-serif" font-weight="bold" fill="white" stroke="black" stroke-width="2" text-anchor="middle" dominant-baseline="hanging">TOP TEXT</text>
       <text x="256" y="462" font-size="60" font-family="Impact, sans-serif" font-weight="bold" fill="white" stroke="black" stroke-width="2" text-anchor="middle" dominant-baseline="alphabetic">BOTTOM TEXT</text>
    </svg>`;
    const finalBuffer = await sharp(bgBuffer).composite([{ input: Buffer.from(svgMeme), blend: 'over' }]).webp().toBuffer();
    fs.writeFileSync('test-smeme-svg.webp', finalBuffer);
    console.log("Success smeme svg");
}
test().catch(console.error);
