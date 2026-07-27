const { brat, bratvid } = require('brat-farel');
const fs = require('fs');

async function test() {
    try {
        const res = await brat("Hello Brat");
        console.log(res); // probably a buffer or object?
        
        const resVid = await bratvid("Hello Bratvid");
        console.log(resVid); // probably a buffer or stream?
    } catch (e) {
        console.error(e);
    }
}
test();
