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
        this.CAUSALITY_WINDOW_MS = 250; // [HU] 250 ms-os időablak a szándékhoz
        this.initListeners();
    }

    initListeners() {
        // [HU] Figyeljük a globális interakciókat
        // [EN] Listen for global interactions
        ['mousedown', 'keydown', 'touchstart'].forEach(eventType => {
            window.addEventListener(eventType, (e) => {
                if (e.isTrusted) {
                    this.generateToken(eventType, e);
                } else {
                    console.warn(`[BioOS] Synthetic event rejected: ${eventType}`);
                }
            }, true);
        });
    }

    generateToken(type, event) {
        this.lastToken = {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            timestamp: Date.now(),
            target: event.target.id || "anonymous_element",
            consumed: false
        };
        console.log(`[BioOS] Causal Token Generated: ${this.lastToken.id} (Source: ${type})`);
    }

    /**
     * [HU] Ellenőrzi, hogy van-e érvényes, fel nem használt szándék-token.
     * [EN] Checks if there is a valid, unconsumed intent token.
     */
    validateIntent() {
        if (!this.lastToken) return false;
        
        const now = Date.now();
        const age = now - this.lastToken.timestamp;

        // [HU] Ellenőrizzük az időablakot és a felhasználtságot
        // [EN] Verify window and consumption status
        if (age <= this.CAUSALITY_WINDOW_MS && !this.lastToken.consumed) {
            this.lastToken.consumed = true; // [HU] Egy token csak egyszer használható fel
            return {
                valid: true,
                tokenId: this.lastToken.id,
                source: this.lastToken.type
            };
        }

        return { valid: false, reason: age > this.CAUSALITY_WINDOW_MS ? "EXPIRED" : "ALREADY_CONSUMED" };
    }

    /**
     * [HU] Manuális token-lekérdezés a Z3 Gatekeeper számára
     * [EN] Manual token query for the Z3 Gatekeeper
     */
    getIntentProof() {
        return this.validateIntent();
    }
}

export default CausalityMonitor;
