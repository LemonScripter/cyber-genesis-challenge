const crypto = require('crypto');

// [HU] 2026-11-07: a korábbi verzió BÁRMILYEN kliens által küldött 'data' szöveget
// aláírt -- ez egy aláíró-orákulum volt: a sandbox tényleges lefuttatása nélkül is
// érvényes "bizonyítékot" lehetett előállítani. Mostantól a kliens csak egy előre
// rögzített forgatókönyv-nevet (scenario) küldhet; a szerver maga számolja ki, mihez
// köti az aláírást. A valódi titok (REAL_KEY) innentől kizárólag itt, szerveroldalon
// létezik -- a kliens (Virtual_CPU.js) már csak egy demonstrációs díszletértéket tárol.
const REAL_KEY = process.env.BIOOS_SECRET_KEY || "BioOS_TITAN_2026";

function sanitizeAddr(addr) {
  const n = parseInt(addr, 16);
  if (!Number.isFinite(n) || n < 0 || n > 0xFFFFFFFF) return '0';
  return n.toString(16);
}

const SCENARIOS = {
  read_bio: () => `WIN_0xDEAD_${REAL_KEY}`,
  export_note: (params) => `WIN_EXPORT_${sanitizeAddr(params && params.addr)}`,
  ui_save: () => `UI_SAVE_OK`,
};

exports.handler = async (event, context) => {
  // [HU] Csak POST kéréseket fogadunk el
  // [EN] Only accept POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { scenario, params, shield_state, fingerprint } = JSON.parse(event.body);

    const build = SCENARIOS[scenario];
    if (typeof build !== 'function') {
      return { statusCode: 400, body: JSON.stringify({ error: "Unknown scenario" }) };
    }
    // [HU] A "read_bio" forgatókönyv a mai állás szerint a kliens oldalon SOHA nem
    // sikerülhet Pajzs BE állapotban (a READ_BIO művelethez nincs axióma) -- ezért a
    // szerver sem állíthatja ezt hitelesnek. Ez nem zárja le a teljes orákulum-rést
    // (a végpont továbbra is közvetlenül hívható), de kizárja a leginkább félrevezető
    // hamis állítást: hogy valaki Pajzs BE mellett "győzött".
    if (scenario === 'read_bio' && shield_state) {
      return { statusCode: 403, body: JSON.stringify({ error: "read_bio nem érvényesíthető Pajzs BE állapotban" }) };
    }
    // [HU] 2026-11-07, második kör: az "export_note" a hirdetett fő feladat (ExportNote
    // aktív Pajzs mellett). A kliens oldalon ez a cél-kötés (intent.target==='save-btn')
    // miatt VALÓDI emberi gépeléssel soha nem érhet el SAT-ot -- a terminálba gépelt
    // parancs minden egyes billentyűje felülírja a kötött célt 'hacker-input'-ra. Tehát
    // minden get_proof("export_note", ...) hívás, ami idáig elérkezik, bypass -- nincs
    // olyan legitim kontextus, amiben ezt hitelesnek kellene mondanunk. Amíg a szerver nem
    // ismeri a sandbox valódi állapotát (session) vagy hardveres jelenlét-bizonyítékot nem
    // követelünk, ezt csak úgy zárhatjuk le hitelesen, hogy mindig elutasítjuk.
    if (scenario === 'export_note') {
      return { statusCode: 403, body: JSON.stringify({ error: "export_note nem érvényesíthető: a felületen nincs legitim út, ami ide elérne" }) };
    }
    const data = build(params || {});

    // [HU] A "SÓ" itt szerveroldalon van, a hacker nem láthatja
    // [EN] The "SALT" is server-side, hidden from the hacker
    const SECRET_SALT = process.env.BIOOS_VERIFY_SALT || "BIOOS_SECRET_SALT_2026_SECURE";

    // [HU] Dinamikus láncolt formula: Adat + Pajzs állapot + Fizikai ujjlenyomat
    // [EN] Dynamic chained formula: Data + Shield state + Physical fingerprint
    const payload = `${data}:${shield_state ? 'ON' : 'OFF'}:${fingerprint}`;

    const hash = crypto.createHmac('sha256', SECRET_SALT)
                       .update(payload)
                       .digest('hex');

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verification_dna: hash })
    };
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
  }
};
