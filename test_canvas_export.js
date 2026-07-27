(async () => {
  try {
    const { createCanvas } = await import('@napi-rs/canvas');
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');
    ctx.fillText("Test", 10, 10);
    console.log("Canvas works");
  } catch (e) {
    console.error("Canvas failed:", e);
  }
})();
