/**
 * BioOS Stats & Verifier Manager
 * 
 * [HU] Kezeli a próbálkozások naplózását és a kriptográfiai hitelesítést.
 * [EN] Manages attempt logging and cryptographic verification.
 */

const STORAGE_KEY = 'bioos_challenge_stats';
const SECRET_SALT = "BIOOS_SECRET_SALT_2026";

export function logAttempt(cmd, shield, result) {
    const attempts = getAttempts();
    const entry = {
        time: new Date().toLocaleString(),
        cmd: cmd,
        shield: shield,
        result: result
    };
    attempts.unshift(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts.slice(0, 100))); // Keep last 100
}

export function getAttempts() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

export async function verifyHash(hash) {
    // [HU] Hitelesíti, hogy a hash származhat-e a mi rendszerünkből
    // [EN] Verifies if the hash could originate from our system
    
    // In this demo, we check against the current session data
    // In production, this would query a backend database of issued tokens.
    const key = "BioOS_TITAN_2026";
    const expected = await generateInternalHash("WIN_0xDEAD_" + key);
    
    return hash === expected;
}

async function generateInternalHash(data) {
    const msgUint8 = new TextEncoder().encode(data + SECRET_SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
