/**
 * BioOS Global Stats Manager (Powered by KVdb.io & Netlify Functions)
 */

const API_URL = `https://kvdb.io/S9UuD7tB7qZ6q5fS7G6S7z/attempts`;

export async function logAttempt(cmd, shield, result) {
    const attempts = await getAttempts();
    const entry = {
        time: new Date().toLocaleString(),
        cmd: cmd,
        shield: shield,
        result: result
    };
    attempts.unshift(entry);
    
    try {
        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(attempts.slice(0, 50))
        });
    } catch (e) {
        console.error("Failed to sync stats to cloud:", e);
    }
}

export async function getAttempts() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        }
    } catch (e) {
        console.warn("Cloud stats unavailable.");
    }
    return [];
}

/**
 * [HU] Hitelesítő kód kérése a szervertől (Netlify Function)
 * [EN] Request verification code from the server (Netlify Function)
 */
export async function getSecureProof(data) {
    try {
        const response = await fetch('/.netlify/functions/get_proof', {
            method: 'POST',
            body: JSON.stringify({ data: data })
        });
        const result = await response.json();
        return result.verification_dna;
    } catch (e) {
        console.error("Security API unavailable.");
        return "ERROR_SEC_OFFLINE";
    }
}

/**
 * [HU] Beküldött kód ellenőrzése a szerveren
 * [EN] Verify submitted code on the server
 */
export async function verifyHash(hash) {
    try {
        const response = await fetch('/.netlify/functions/check_proof', {
            method: 'POST',
            body: JSON.stringify({ hash: hash })
        });
        const result = await response.json();
        return result.valid;
    } catch (e) {
        return false;
    }
}
