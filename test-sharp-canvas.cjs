const { createCanvas } = require('@napi-rs/canvas');
const sharp = require('sharp');
const fs = require('fs');

async function test() {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 512, 512);
    
    try {
        const buffer = canvas.toBuffer('image/png');
        const stickerBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
        fs.writeFileSync('test-sharp-canvas.webp', stickerBuffer);
        console.log("Success");
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
