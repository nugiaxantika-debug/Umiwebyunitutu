const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');

async function testSmeme(atas, bawah) {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, 512, 512);
    
    ctx.font = 'bold 48px Impact, Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    
    ctx.textBaseline = 'top';
    ctx.strokeText(atas, 256, 10);
    ctx.fillText(atas, 256, 10);
    
    ctx.textBaseline = 'bottom';
    ctx.strokeText(bawah, 256, 502);
    ctx.fillText(bawah, 256, 502);
    
    fs.writeFileSync('test-smeme.png', canvas.toBuffer('image/png'));
}

testSmeme("TOP TEXT HERE", "BOTTOM TEXT").catch(console.error);
