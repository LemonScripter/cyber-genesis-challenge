const crypto = require('crypto');

exports.handler = async (event, context) => {
  // [HU] Csak POST kéréseket fogadunk el
  // [EN] Only accept POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { data, action } = JSON.parse(event.body);
    
    // [HU] A "SÓ" itt szerveroldalon van, a hacker nem láthatja
    // [EN] The "SALT" is server-side, hidden from the hacker
    const SECRET_SALT = process.env.BIOOS_VERIFY_SALT || "BIOOS_SECRET_SALT_2026_SECURE";
    
    // [HU] SHA-256 HMAC generálása
    // [EN] Generate SHA-256 HMAC
    const hash = crypto.createHmac('sha256', SECRET_SALT)
                       .update(data)
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
