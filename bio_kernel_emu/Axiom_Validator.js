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
        
        this.axioms = {
            WRITE: (addr, intent) => {
                const isHeap = addr >= 0x1000 && addr <= 0x2FFF;
                return isHeap && intent.valid && intent.source === 'mousedown';
            },
            EXPORT: (addr, intent) => {
                const isHeap = addr >= 0x1000 && addr <= 0x2FFF;
                // [HU] Idő alapú okozatiság: a hálózati küldés csak a gombnyomás utáni 500ms-on belül érvényes
                const age = Date.now() - (intent.timestamp || 0);
                return isHeap && intent.valid && intent.target === 'save-btn' && age < 500;
            },
            READ_BIO: (addr, intent) => false,
            REG_WRITE: (reg, value, intent) => false,
            DATA_MOD: (params, intent) => {
                return intent.valid && intent.type === 'keydown';
            },
            SHADOW_WRITE: (addr, intent) => false,
            SQL_QUERY: (query, intent) => {
                return intent.valid && !query.includes("'") && !query.includes("--");
            },
            BANK_TRANSFER: (amount, intent) => {
                return intent.valid && intent.target === 'save-btn' && amount < 1000;
            },
            DRONE_GPS: (coords, intent) => intent.valid && intent.source === 'drone-controller',
            TIMING_MEASURE: (intent) => {
                // [HU] Side-channel védelem: csak a rendszerprofilozó mérhet időt.
                // [EN] Side-channel defense: only system profiler can measure high-res time.
                return false; 
            },
            AUTONOMOUS_ACTION: (intent) => {
                // [HU] Minden autonóm (IRQ nélküli) tevékenység tiltott.
                return false;
            }
        };
    }

    verify(operation, params) {
        console.log(`[BioOS] Verifying: ${operation}`, params);
        const intent = this.monitor.getIntentProof();
        let result = false;

        switch (operation) {
            case 'MEM_WRITE': result = this.axioms.WRITE(params.address, intent); break;
            case 'NET_EXPORT': result = this.axioms.EXPORT(params.address, intent); break;
            case 'READ_BIO': result = this.axioms.READ_BIO(params.address, intent); break;
            case 'REG_WRITE': result = this.axioms.REG_WRITE(params.register, params.value, intent); break;
            case 'DATA_MOD': result = this.axioms.DATA_MOD(params, intent); break;
            case 'SHADOW_WRITE': result = this.axioms.SHADOW_WRITE(params.address, intent); break;
            case 'SQL_QUERY': result = this.axioms.SQL_QUERY(params.query, intent); break;
            case 'BANK_TRANSFER': result = this.axioms.BANK_TRANSFER(params.amount, intent); break;
            case 'DRONE_GPS': result = this.axioms.DRONE_GPS(params, intent); break;
            case 'TIMING_MEASURE': result = this.axioms.TIMING_MEASURE(intent); break;
            case 'AUTONOMOUS': result = this.axioms.AUTONOMOUS_ACTION(intent); break;
            default: result = false;
        }

        if (result) {
            return { status: 'SAT', tokenId: intent.tokenId };
        } else {
            const reason = intent.valid ? "Axiom Violation" : `Causality Breach (${intent.reason || 'No IRQ'})`;
            return { status: 'UNSAT', reason: reason };
        }
    }
}

export default AxiomValidator;
