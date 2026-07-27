const { createCanvas, GlobalFonts, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');

async function testBrat(text) {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 512, 512);
    
    ctx.fillStyle = 'black';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';
    
    for (let word of words) {
        let testLine = currentLine + word + ' ';
        if (ctx.measureText(testLine).width > 480 && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);
    
    const lineHeight = 90;
    const totalHeight = lines.length * lineHeight;
    let startY = (512 - totalHeight) / 2 + (lineHeight / 2);
    
    for (let line of lines) {
        ctx.fillText(line.trim(), 256, startY);
        startY += lineHeight;
    }
    
    fs.writeFileSync('test-brat.png', canvas.toBuffer('image/png'));
}

testBrat("Brat Summer Text Here And More And More").catch(console.error);
