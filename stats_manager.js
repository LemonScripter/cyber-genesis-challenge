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

export async function getStats() {
    try {
        const response = await fetch('/.netlify/functions/sync_stats');
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        console.error("[BioOS] Error fetching global stats.");
    }
    return { total: 0, blocked: 0, recent: [] };
}

// [HU] 2026-11-07: NEM szabad fogalmazasu 'data' szoveget kuldunk tobbe a szervernek --
// csak egy elore rogzitett forgatokonyv-nevet (scenario) es a hozza tartozo, nem-titkos
// parametereket. A szerver maga szamolja ki, mihez koti az alairast (lasd get_proof.js).
// Ez zarja le az aláíró-orákulum rést: a kliens nem tud tetszőleges szöveget aláíratni.
export async function getSecureProof(scenario, params, shieldState, fingerprint) {
    try {
        const response = await fetch('/.netlify/functions/get_proof', {
            method: 'POST',
            body: JSON.stringify({
                scenario: scenario,
                params: params || {},
                shield_state: shieldState,
                fingerprint: fingerprint
            })
        });
        const result = await response.json();
        return result.verification_dna;
    } catch (e) {
        return "ERROR_SEC_OFFLINE";
    }
}

export async function verifyHash(hash, fingerprint) {
    try {
        const response = await fetch('/.netlify/functions/check_proof', {
            method: 'POST',
            body: JSON.stringify({ 
                hash: hash,
                fingerprint: fingerprint
            })
        });
        const result = await response.json();
        return result; // [HU] Most már a teljes objektumot adjuk vissza (valid, mode)
    } catch (e) {
        return { valid: false, mode: "NONE" };
    }
}
