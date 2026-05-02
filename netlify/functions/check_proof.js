const crypto = require('crypto');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { hash } = JSON.parse(event.body);
    const SECRET_SALT = process.env.BIOOS_VERIFY_SALT || "BIOOS_SECRET_SALT_2026_SECURE";
    const key = "BioOS_TITAN_2026";
    
    // [HU] Újraszámoljuk az elvárt hash-t a szerveroldali sóval
    // [EN] Recalculate expected hash using the server-side salt
    const expected = crypto.createHmac('sha256', SECRET_SALT)
                           .update("WIN_0xDEAD_" + key)
                           .digest('hex');

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valid: hash === expected })
    };
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
  }
};
