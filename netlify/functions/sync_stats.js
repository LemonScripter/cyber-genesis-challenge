const { Client } = require('pg');

// [HU] Biztonsági javítás: A DATABASE_URL mostantól CSAK környezeti változóból jön
// [EN] Security fix: DATABASE_URL now ONLY comes from environment variables
const DATABASE_URL = process.env.DATABASE_URL;

exports.handler = async (event, context) => {
    if (!DATABASE_URL) {
        return { statusCode: 500, body: "DATABASE_URL is not defined in environment variables." };
    }
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();

        // [HU] Tábla létrehozása ha nem létezik
        // [EN] Create table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS attempts (
                id SERIAL PRIMARY KEY,
                time TEXT,
                cmd TEXT,
                shield BOOLEAN,
                result TEXT
            );
        `);

        if (event.httpMethod === "GET") {
            const totalRes = await client.query('SELECT COUNT(*) FROM attempts');
            const blockedRes = await client.query("SELECT COUNT(*) FROM attempts WHERE result = 'UNSAT'");
            const recentRes = await client.query('SELECT time, cmd, shield, result FROM attempts ORDER BY id DESC LIMIT 50');
            
            await client.end();
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({
                    total: parseInt(totalRes.rows[0].count),
                    blocked: parseInt(blockedRes.rows[0].count),
                    recent: recentRes.rows
                })
            };
        }

        if (event.httpMethod === "POST") {
            const { time, cmd, shield, result } = JSON.parse(event.body);
            await client.query(
                'INSERT INTO attempts (time, cmd, shield, result) VALUES ($1, $2, $3, $4)',
                [time, cmd, shield, result]
            );
            await client.end();
            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: "OK"
            };
        }

        await client.end();
        return { statusCode: 405, body: "Method Not Allowed" };

    } catch (e) {
        if (client) await client.end();
        console.error("[BioOS DB] Error:", e);
        return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
    }
};
