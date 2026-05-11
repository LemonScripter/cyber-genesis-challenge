const crypto = require('crypto');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { hash, fingerprint } = JSON.parse(event.body);
    const SECRET_SALT = process.env.BIOOS_VERIFY_SALT || "BIOOS_SECRET_SALT_2026_SECURE";
    const key = "BioOS_TITAN_2026";
    const data = "WIN_0xDEAD_" + key;
    
    // [HU] Ellenőrizzük mindkét állapotot (ON és OFF)
    // [EN] Check both states (ON and OFF)
    const expectedON = crypto.createHmac('sha256', SECRET_SALT)
                             .update(`${data}:ON:${fingerprint}`)
                             .digest('hex');
                             
    const expectedOFF = crypto.createHmac('sha256', SECRET_SALT)
                              .update(`${data}:OFF:${fingerprint}`)
                              .digest('hex');

    if (hash === expectedON) {
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valid: true, mode: "ON" })
        };
    } else if (hash === expectedOFF) {
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valid: true, mode: "OFF" })
        };
    } else {
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valid: false, mode: "NONE" })
        };
    }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
  }
};
