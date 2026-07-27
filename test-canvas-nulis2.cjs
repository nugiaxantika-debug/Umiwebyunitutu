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
        ctx.textBaseline = 'alphabetic';
        
        ctx.font = '20px "Indie Flower"';
        ctx.fillText('Rabu', 806, 78);
        
        ctx.font = '18px "Indie Flower"';
        ctx.fillText('27/07/2026', 806, 102);
        
        ctx.fillText('User', 360, 100);
        ctx.fillText('-', 360, 120);
        
        ctx.font = '20px "Indie Flower"';
        
        const teks = "Aku suka banget main di google cloud, ternyata gampang banget cuy, ga perlu ribet-ribet konfigurasi server";
        const panjangKalimat5 = teks.replace(/(\S+\s*){1,10}/g, '$&\n');
        const lines = panjangKalimat5.split('\n').slice(0, 33);
        
        let startY = 142;
        const lineHeight = 19; 
        
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 344, startY + (i * lineHeight));
        }
        
        const buffer = canvas.toBuffer('image/jpeg');
        fs.writeFileSync('test_nulis_canvas2.jpg', buffer);
        console.log('Success, saved to test_nulis_canvas2.jpg');
    } catch (e) {
        console.error(e);
    }
}
test();
