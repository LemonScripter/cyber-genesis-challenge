/**
 * BioOS Causality Monitor
 * 
 * [HU] Ez a modul figyeli a valódi hardveres eseményeket és generálja a Kauzális Tokeneket.
 * Csak a böngésző által hitelesített (isTrusted) eseményeket fogadja el.
 * 
 * [EN] This module monitors genuine hardware events and generates Causal Tokens.
 * It only accepts events authenticated by the browser (isTrusted).
 */

class CausalityMonitor {
    constructor() {
        this.lastToken = null;
        this.CAUSALITY_WINDOW_MS = 250;
        this.FINGERPRINT_WINDOW_MS = 5000; // [HU] 5 másodperces DNA ablak
        this.logicalTick = 0; // [HU] Belső, korrupt-biztos logikai számláló
        this.onCausalPulse = null; // [HU] UI visszacsatolás érvényes IRQ esetén
        this.initListeners();
    }

    initListeners() {
        ['mousedown', 'keydown', 'touchstart'].forEach(eventType => {
            window.addEventListener(eventType, (e) => {
                if (e.isTrusted) {
                    this.logicalTick++; // Minden fizikai interakció növeli a logikai időt
                    this.generateToken(eventType, e);
                    if (this.onCausalPulse) this.onCausalPulse(eventType);
                }
            }, true);
        });
    }

    generateToken(type, event) {
        const timestamp = performance.now();
        const fingerprintBase = `${event.timeStamp}-${type}-${this.logicalTick}-${event.isTrusted}`;
        
        this.lastToken = {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            timestamp: timestamp,
            fingerprint: this.hashData(fingerprintBase),
            tick: this.logicalTick,
            target: event.target ? (event.target.id || "anonymous_element") : "simulated_target",
            dataChecksum: null, // [HU] Opcionális adat-integritás ellenőrző
            consumed: false,
            boundOperation: null,
            isTrusted: event.isTrusted
        };
    }

    /**
     * [HU] Szimulált autonóm kísérlet (Hacker malware szimulációhoz)
     * [EN] Simulated autonomous attempt (for malware simulation)
     */
    simulateAutonomousAttempt() {
        this.logicalTick++;
        this.generateToken('script_injection', { isTrusted: false, timeStamp: performance.now(), target: { id: 'malware-agent' } });
        return this.lastToken.id;
    }

    getLatestFingerprint() {
        if (!this.lastToken) return "NO_TOKEN";
        const now = performance.now();
        const age = now - this.lastToken.timestamp;
        
        if (age > this.FINGERPRINT_WINDOW_MS) return "EXPIRED";
        
        return this.lastToken.fingerprint;
    }

    /**
     * [HU] Szándék verifikáció kiterjesztett adathitelesítéssel.
     * @param {string} requestedOperation 
     * @param {string} dataToBind - Az adathalmaz, amihez a szándékot kötjük.
     */
    validateIntent(requestedOperation = null, dataToBind = null) {
        if (!this.lastToken) return { valid: false, reason: "NO_TOKEN" };
        
        const now = performance.now();
        const age = now - this.lastToken.timestamp;

        if (this.lastToken.consumed) return { valid: false, reason: "ALREADY_CONSUMED" };
        if (age > this.CAUSALITY_WINDOW_MS) return { valid: false, reason: "EXPIRED" };

        // [HU] Intent Consistency
        if (this.lastToken.boundOperation && this.lastToken.boundOperation !== requestedOperation) {
            return { valid: false, reason: "INTENT_MISMATCH" };
        }

        // [HU] Data-Bound Integrity: Ha már van kötött adat, az újan kértnek egyeznie kell
        if (dataToBind && this.lastToken.dataChecksum && this.lastToken.dataChecksum !== this.hashData(dataToBind)) {
            return { valid: false, reason: "DATA_INTEGRITY_VIOLATION" };
        }

        this.lastToken.consumed = true;
        this.lastToken.boundOperation = requestedOperation;
        if (dataToBind) this.lastToken.dataChecksum = this.hashData(dataToBind);
        
        return {
            valid: true,
            tokenId: this.lastToken.id,
            tick: this.lastToken.tick,
            source: this.lastToken.type,
            target: this.lastToken.target,
            timestamp: this.lastToken.timestamp
        };
    }

    hashData(str) {
        // [HU] Gyors szimulált hash az integritáshoz
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString();
    }

    getIntentProof(requestedOperation = null, dataToBind = null) {
        return this.validateIntent(requestedOperation, dataToBind);
    }
}

export default CausalityMonitor;
