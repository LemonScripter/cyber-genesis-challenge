const fetch = require('node-fetch');

// [HU] Publikus tároló a statisztikáknak
// [EN] Public storage for stats
const BIN_ID = "6633b49facd3697a6d619934"; // A dedicated public bin for BioOS
const API_KEY = "$2b$10$wE/x3m1A0FhXmK1a9.qEouGvR9H0fH3YfO.P6fXmK1a9.qEouGvR"; // Global public access key

exports.handler = async (event, context) => {
  const url = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  if (event.httpMethod === "GET") {
    try {
      const response = await fetch(url + "/latest", {
        headers: { "X-Master-Key": API_KEY }
      });
      const data = await response.json();
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
      const getRes = await fetch(url + "/latest", {
        headers: { "X-Master-Key": API_KEY }
      });
      const current = await getRes.json();
      let attempts = current.record.attempts || [];
      
      attempts.unshift(newEntry);
      attempts = attempts.slice(0, 50); // Keep last 50

      // Update bin
      await fetch(url, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY
        },
        body: JSON.stringify({ attempts: attempts })
      });

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
