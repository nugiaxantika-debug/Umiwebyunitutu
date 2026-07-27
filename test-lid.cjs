const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function run() {
    const { state } = await useMultiFileAuthState("auth_info_baileys_default");
    const sock = makeWASocket({ auth: state, logger: pino({ level: 'silent' }) });
    
    sock.ev.on("connection.update", async (update) => {
        if(update.connection === "open") {
            try {
                const res = await sock.onWhatsApp("6289692080379");
                console.log("RESULT (without +):", JSON.stringify(res));
                
                const res2 = await sock.onWhatsApp("+6289692080379");
                console.log("RESULT (with +):", JSON.stringify(res2));
                
                // Is there another way to get LID?
                // maybe from store? or contacts?
            } catch(e) {
                console.log("ERR:", e.message);
            }
            process.exit(0);
        }
    });
}
run();
