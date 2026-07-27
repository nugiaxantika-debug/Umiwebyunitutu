const teks = "Ini adalah contoh teks yang panjang";
const p1 = teks.replace(/(\S+\s*){1,10}/g, '$$&\n');
const p2 = teks.replace(/(\S+\s*){1,10}/g, '$&\n');
console.log("P1:", p1);
console.log("P2:", p2);
