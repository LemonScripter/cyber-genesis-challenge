/**
 * BioOS Global Stats Manager (Powered by Netlify Functions)
 */

export async function logAttempt(cmd, shield, result) {
    const entry = {
        time: new Date().toLocaleString(),
        cmd: cmd,
        shield: shield,
        result: result
    };

    // [HU] Szinkronizálás a szerveren keresztül
    // [EN] Sync through the server
    try {
        await fetch('/.netlify/functions/sync_stats', {
            method: 'POST',
            body: JSON.stringify(entry)
        });
    } catch (e) {
        console.error("[BioOS] Cloud sync failed.", e);
    }
}

export async function getAttempts() {
    try {
        const response = await fetch('/.netlify/functions/sync_stats');
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        console.error("[BioOS] Error fetching global stats.");
    }
    return [];
}

export async function getSecureProof(data) {
    try {
        const response = await fetch('/.netlify/functions/get_proof', {
            method: 'POST',
            body: JSON.stringify({ data: data })
        });
        const result = await response.json();
        return result.verification_dna;
    } catch (e) {
        return "ERROR_SEC_OFFLINE";
    }
}

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
