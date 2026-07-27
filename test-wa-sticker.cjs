(async () => {
  try {
    const { Sticker } = await import('wa-sticker-formatter');
    console.log("Sticker loaded:", !!Sticker);
  } catch (e) {
    console.error("Error wa-sticker:", e);
  }
})();
