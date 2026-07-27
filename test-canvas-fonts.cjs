(async () => {
    try {
        const { createCanvas, GlobalFonts } = await import('@napi-rs/canvas');
        console.log("Available fonts:", GlobalFonts.families.map(f => f.family));
        const canvas = createCanvas(512, 512);
        const ctx = canvas.getContext('2d');
        ctx.font = 'bold 80px Arial';
        ctx.fillText("Hello", 100, 100);
        console.log("Success with Arial");
    } catch(e) {
        console.error("Error:", e);
    }
})();
