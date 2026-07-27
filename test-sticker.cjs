const { Sticker } = require('wa-sticker-formatter');
const fs = require('fs');

async function test() {
    const buffer = fs.readFileSync('real_test.mp4');
    const sticker = new Sticker(buffer, { pack: 'Tostiker', author: 'Bot', type: 'full', quality: 50 });
    const stickerBuffer = await sticker.toBuffer();
    fs.writeFileSync('test_out.webp', stickerBuffer);
    console.log("Done");
}

test().catch(console.error);
