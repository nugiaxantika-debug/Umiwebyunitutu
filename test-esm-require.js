try {
  require('@napi-rs/canvas');
} catch (e) {
  console.error("Caught:", e.message);
}
