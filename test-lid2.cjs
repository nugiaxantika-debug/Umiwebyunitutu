const axios = require('axios');
async function test() {
    try {
        const res = await axios.post('http://localhost:3000/api/whatsapp/test-onwa', {
            email: 'default',
            jid: '6289692080379@s.whatsapp.net'
        });
        console.log("RESULT:", res.data);
    } catch(e) {
        console.error(e.message);
    }
}
test();
