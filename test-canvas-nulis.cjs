const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

async function test() {
    try {
        const nulisDir = path.join(process.cwd(), 'node_modules', 'nulis-buku');
        const bgPath = path.join(nulisDir, 'assets', 'buku1.jpg');
        const fontPath = path.join(nulisDir, 'font', 'Indie-Flower.ttf');
        
        GlobalFonts.registerFromPath(fontPath, 'Indie Flower');
        
        const image = await loadImage(bgPath);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#1b1b1b';
        ctx.textBaseline = 'alphabetic'; // this is the default
        
        ctx.font = '20px "Indie Flower"';
        ctx.fillText('Rabu', 806, 78);
        
        ctx.font = '18px "Indie Flower"';
        ctx.fillText('27/07/2026', 806, 102);
        
        ctx.fillText('User', 360, 100);
        ctx.fillText('-', 360, 120);
        
        ctx.font = '20px "Indie Flower"';
        
        const text = "Ini adalah contoh teks\nyang panjang\nuntuk ditulis di atas buku.\nBisa beberapa baris.";
        const lines = text.split('\n');
        
        let startY = 142;
        // ImageMagick interline-spacing is -7.5, pointsize 20. 
        // Default line height in IM is usually ~ 1.2 * pointsize?
        // Let's use a fixed line height that looks right. 
        // 20px font + -7.5 interline = maybe 20 - 7.5 = 12.5? or 24 - 7.5 = 16.5?
        // Let's print 10 lines and see
        const lineHeight = 19; 
        
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 344, startY + (i * lineHeight));
        }
        
        const buffer = canvas.toBuffer('image/jpeg');
        fs.writeFileSync('test_nulis_canvas.jpg', buffer);
        console.log('Success, saved to test_nulis_canvas.jpg');
    } catch (e) {
        console.error(e);
    }
}
test();
