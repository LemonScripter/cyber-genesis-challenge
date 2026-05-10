/**
 * BioOS Axiom Validator (Z3 Logic Simulation)
 * 
 * [HU] Ez a modul végzi a formális verifikációt. 
 * [EN] This module performs formal verification.
 */

class AxiomValidator {
    constructor(cpu, monitor) {
        this.cpu = cpu;
        this.monitor = monitor;
    }

    verify(operation, params) {
        console.log(`[BioOS] Verifying: ${operation}`, params);
        
        // [HU] Data-Bound Context lekérése (v5.0.4)
        const dataToBind = params.data || null;
        const intent = this.monitor.getIntentProof(operation, dataToBind);
        let result = false;

        // [HU] Pozitív Axióma Készlet (v5.0.4+)
        const axioms = {
            WRITE: (addr, intent, data) => {
                const isHeap = addr >= 0x1000 && addr <= 0x2FFF;
                return isHeap && intent.valid && intent.target === 'save-btn' && data !== null;
            },
            EXPORT: (addr, intent) => {
                const isHeap = addr >= 0x1000 && addr <= 0x2FFF;
                const age = performance.now() - (intent.timestamp || 0);
                return isHeap && intent.valid && intent.target === 'save-btn' && age < 500;
            },
            SQL_QUERY: (query, intent) => {
                const allowed = ["select * from notes", "select count(*) from logs"];
                const sanitized = (query || "").trim().toLowerCase();
                return intent.valid && allowed.includes(sanitized);
            },
            DRONE_GPS: (coords, intent) => intent.valid && intent.source === 'drone-controller' && intent.target === 'drone-map',
            META_DISABLE: (intent) => intent.valid && intent.target === 'shield-toggle',
            AUTONOMOUS: (intent) => false
        };

        switch (operation) {
            case 'MEM_WRITE': result = axioms.WRITE(params.address, intent, params.data); break;
            case 'NET_EXPORT': result = axioms.EXPORT(params.address, intent); break;
            case 'SQL_QUERY': result = axioms.SQL_QUERY(params.query, intent); break;
            case 'DRONE_GPS': result = axioms.DRONE_GPS(params, intent); break;
            case 'META_DISABLE': result = axioms.META_DISABLE(intent); break;
            case 'AUTONOMOUS': result = axioms.AUTONOMOUS(intent); break;
            default: result = false;
        }

        if (result) {
            // [HU] v5.0.5: Atomicitás biztosítása - CPU zárolása a sikeres verifikáció után
            // [EN] v5.0.5: Ensuring Atomicity - Locking the CPU after successful verification
            if (this.cpu) {
                this.cpu.lockForTransition(intent.tokenId || "internal");
            }
            return { status: 'SAT', tokenId: intent.tokenId };
        } else {
            const reason = intent.valid ? "Axiom Violation" : `Causality Breach (${intent.reason || 'No IRQ'})`;
            return { status: 'UNSAT', reason: reason };
        }
    }
}

export default AxiomValidator;
