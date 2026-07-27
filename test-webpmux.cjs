const { default: webpmux } = require('node-webpmux');
async function run() {
    console.log("webpmux exists:", !!webpmux);
}
run().catch(console.error);
