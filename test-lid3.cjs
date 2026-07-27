const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function run() {
    const { state } = await useMultiFileAuthState("auth_info_baileys_default");
    const sock = makeWASocket({ auth: state, logger: pino({ level: 'silent' }) });
    
    sock.ev.on("connection.update", async (update) => {
        if(update.connection === "open") {
            try {
                const jid = "6289692080379@s.whatsapp.net";
                
                // Try signalRepository lid mapping
                const lid = await sock.signalRepository.lidMapping.getLIDForPN(jid);
                console.log("LID mapping result:", lid);
                
                const lid2 = await sock.onWhatsApp("6289692080379");
                console.log("onWhatsApp result:", JSON.stringify(lid2));

            } catch(e) {
                console.log("ERR:", e.message);
            }
            process.exit(0);
        }
    });
}
run();
