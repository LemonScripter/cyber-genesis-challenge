/**
 * BioOS Global Stats Manager (Powered by KVdb.io & Netlify Functions)
 */

const API_URL = `https://kvdb.io/S9UuD7tB7qZ6q5fS7G6S7z/attempts`;
const STORAGE_KEY = 'bioos_local_fallback_stats';

export async function logAttempt(cmd, shield, result) {
    const entry = {
        time: new Date().toLocaleString(),
        cmd: cmd,
        shield: shield,
        result: result
    };

    // [HU] 1. Mentés helyben (Fallback)
    // [EN] 1. Save locally (Fallback)
    const localAttempts = getLocalAttempts();
    localAttempts.unshift(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localAttempts.slice(0, 50)));

    // [HU] 2. Szinkronizálás a felhőbe
    // [EN] 2. Sync to cloud
    try {
        const currentCloud = await getAttempts();
        currentCloud.unshift(entry);
        
        await fetch(API_URL, {
            method: 'POST',
            mode: 'cors', // Ensure CORS is handled
            body: JSON.stringify(currentCloud.slice(0, 50))
        });
        console.log("[BioOS] Stats synced to cloud.");
    } catch (e) {
        console.error("[BioOS] Cloud sync failed, using local memory.", e);
    }
}

function getLocalAttempts() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

export async function getAttempts() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            const cloudData = Array.isArray(data) ? data : [];
            
            // [HU] Összefésüljük a helyi és felhő adatokat a teljességért
            // [EN] Merge local and cloud data for completeness
            const local = getLocalAttempts();
            const merged = [...local, ...cloudData];
            
            // Remove duplicates based on timestamp and command
            const unique = merged.filter((v, i, a) => 
                a.findIndex(t => (t.time === v.time && t.cmd === v.cmd)) === i
            );

            return unique.slice(0, 50);
        }
    } catch (e) {
        console.warn("[BioOS] Fetching cloud stats failed. Returning local fallback.");
    }
    return getLocalAttempts();
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
        console.error("Security API unavailable.");
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
