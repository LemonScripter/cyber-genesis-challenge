const https = require('https');

// [HU] Publikus tároló a statisztikáknak
// [EN] Public storage for stats
const BIN_ID = "6633b49facd3697a6d619934"; 
const API_KEY = "$2b$10$wE/x3m1A0FhXmK1a9.qEouGvR9H0fH3YfO.P6fXmK1a9.qEouGvR"; 

/**
 * [HU] Segédfüggvény a JSONBin hívásokhoz a natív https modullal
 * [EN] Helper function for JSONBin calls using native https module
 */
function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
        });
        req.on('error', (e) => reject(e));
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

exports.handler = async (event, context) => {
    const commonHeaders = {
        "X-Master-Key": API_KEY,
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "GET") {
        try {
            const data = await request({
                hostname: 'api.jsonbin.io',
                path: `/v3/b/${BIN_ID}/latest`,
                method: 'GET',
                headers: commonHeaders
            });
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify(data.record.attempts || [])
            };
        } catch (e) {
            return { statusCode: 500, body: "Error fetching stats" };
        }
    }

    if (event.httpMethod === "POST") {
        try {
            const newEntry = JSON.parse(event.body);
            
            // Get current data
            const current = await request({
                hostname: 'api.jsonbin.io',
                path: `/v3/b/${BIN_ID}/latest`,
                method: 'GET',
                headers: commonHeaders
            });

            let attempts = current.record.attempts || [];
            attempts.unshift(newEntry);
            attempts = attempts.slice(0, 50);

            // Update bin
            await request({
                hostname: 'api.jsonbin.io',
                path: `/v3/b/${BIN_ID}`,
                method: 'PUT',
                headers: commonHeaders
            }, { attempts: attempts });

            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: "OK"
            };
        } catch (e) {
            return { statusCode: 500, body: "Error saving stats" };
        }
    }

    return { statusCode: 405, body: "Method Not Allowed" };
};
