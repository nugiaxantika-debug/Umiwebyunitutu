(async () => {
    try {
        const { createCanvas, loadImage } = await import('@napi-rs/canvas');
        console.log(createCanvas);
    } catch(e) {
        console.error(e);
    }
})();
