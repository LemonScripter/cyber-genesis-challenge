const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://netlifydb_owner:npg_evIDxlwnf2t5@ep-lucky-cloud-aj5ax6l6.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require";

exports.handler = async (event, context) => {
    const client = new Client({
        connectionString: DATABASE_URL,
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
            const res = await client.query('SELECT time, cmd, shield, result FROM attempts ORDER BY id DESC LIMIT 50');
            await client.end();
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify(res.rows)
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
