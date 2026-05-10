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
        this.initListeners();
    }

    initListeners() {
        ['mousedown', 'keydown', 'touchstart'].forEach(eventType => {
            window.addEventListener(eventType, (e) => {
                if (e.isTrusted) {
                    this.generateToken(eventType, e);
                }
            }, true);
        });
    }

    generateToken(type, event) {
        // [HU] performance.now() használata a Date.now() helyett az időmanipuláció ellen
        this.lastToken = {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            timestamp: performance.now(),
            target: event.target.id || "anonymous_element",
            consumed: false,
            boundOperation: null // [HU] Összekapcsolás egy konkrét művelettel
        };
    }

    validateIntent(requestedOperation = null) {
        if (!this.lastToken) return { valid: false, reason: "NO_TOKEN" };
        
        const now = performance.now();
        const age = now - this.lastToken.timestamp;

        if (this.lastToken.consumed) return { valid: false, reason: "ALREADY_CONSUMED" };
        if (age > this.CAUSALITY_WINDOW_MS) return { valid: false, reason: "EXPIRED" };

        // [HU] Logikai szigorítás: Egy token csak egyféle művelethez használható fel (Intent Consistency)
        if (this.lastToken.boundOperation && this.lastToken.boundOperation !== requestedOperation) {
            return { valid: false, reason: "INTENT_MISMATCH" };
        }

        this.lastToken.consumed = true;
        this.lastToken.boundOperation = requestedOperation;
        
        return {
            valid: true,
            tokenId: this.lastToken.id,
            source: this.lastToken.type,
            target: this.lastToken.target,
            timestamp: this.lastToken.timestamp
        };
    }

    getIntentProof(requestedOperation = null) {
        return this.validateIntent(requestedOperation);
    }
}

export default CausalityMonitor;
