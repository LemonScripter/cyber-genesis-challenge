/**
 * BioOS Virtual CPU Core (V-CPU)
 * 
 * [HU] Ez a modul felel a virtuális gép alacsony szintű működéséért. 
 * Kezeli a szegmentált memóriát (TEXT, HEAP, STACK) és a regisztereket.
 * Nincs mockolás: minden írási/olvasási kísérlet valódi memóriacímeken történik.
 * 
 * [EN] This module is responsible for the low-level operations of the virtual machine.
 * It manages segmented memory (TEXT, HEAP, STACK) and registers.
 * No mocking: every read/write attempt occurs on real virtual memory addresses.
 */

class VirtualCPU {
    constructor() {
        // Memory Segments
        this.segments = {
            TEXT:  { start: 0x0000, end: 0x0FFF, data: new Uint8Array(4096), name: "Code Segment (Read-Only)" },
            HEAP:  { start: 0x1000, end: 0x2FFF, data: new Uint8Array(8192), name: "Data Segment (Read/Write)" },
            STACK: { start: 0x3000, end: 0x3FFF, data: new Uint8Array(4096), name: "Stack Segment (LIFO)" },
            BIO:   { start: 0xDEAD, end: 0xDEAF, data: new Uint8Array(16),   name: "Bio-Protected DNA Zone" },
            SHADOW_LOG: { start: 0x5000, end: 0x5FFF, data: new Uint8Array(4096), name: "Unauthorized Shadow Storage" },
            DATABASE: { start: 0x6000, end: 0x6FFF, data: new Uint8Array(4096), name: "Virtual Bank Database" }
        };

        this.registers = { IP: 0x0000, SP: 0x3FFF, FLAGS: 0x0, PRIV: 0x0 };

        // [HU] v5.0.6: Atomi Tranzakciós Modell
        // [EN] v5.0.6: Atomic Transaction Model
        this.transactionState = 'IDLE'; // IDLE, LOCKED, STAGED
        this.stagingBuffer = new Map(); // [HU] Ideiglenes memória-tároló a commit előtt
        this.activeTransactionId = null;

        this.initMemory();
    }

    /**
     * [HU] Tranzakciós életciklus: 1. LOCK
     */
    lockForTransition(transactionId) {
        if (this.transactionState !== 'IDLE') {
            throw new Error(`[CPU_FAULT] State Collision: Cannot lock in ${this.transactionState} state.`);
        }
        this.transactionState = 'LOCKED';
        this.activeTransactionId = transactionId;
        this.stagingBuffer.clear();
    }

    /**
     * [HU] Tranzakciós életciklus: 2. WRITE (Staging)
     */
    write(address, value) {
        if (this.transactionState !== 'LOCKED' && this.transactionState !== 'STAGED') {
            throw new Error("[CPU_FAULT] Transactional Violation: No active lock.");
        }

        const seg = this.getSegment(address);
        if (!seg) throw new Error(`[FAULT] Segmentation fault: 0x${address.toString(16)}`);

        // Szigorú szegmens-ellenőrzés
        if ((seg === this.segments.TEXT || seg === this.segments.BIO) && this.registers.PRIV === 0) {
            this.rollback();
            throw new Error(`[CRITICAL] Security violation at 0x${address.toString(16)}. Rollback initiated.`);
        }

        // [HU] Nem írunk közvetlenül a memóriába, csak a staging bufferbe
        this.stagingBuffer.set(address, value & 0xFF);
        this.transactionState = 'STAGED';
    }

    /**
     * [HU] Tranzakciós életciklus: 3. COMMIT
     * Csak itt válik a változás véglegessé és láthatóvá.
     */
    commit() {
        if (this.transactionState !== 'STAGED') {
            if (this.transactionState === 'LOCKED') { this.unlock(); return; } // Üres tranzakció
            throw new Error("[CPU_FAULT] Commit Error: No data staged for transition.");
        }

        // [HU] Atomi írás a fizikai szegmensekbe
        for (const [address, value] of this.stagingBuffer) {
            const seg = this.getSegment(address);
            seg.data[address - seg.start] = value;
        }

        console.log(`[V-CPU] Transaction ${this.activeTransactionId} committed successfully.`);
        this.unlock();
    }

    /**
     * [HU] Tranzakciós életciklus: ROLLBACK (Hibakezelés)
     * Bármilyen hiba esetén a staging buffer megsemmisül, a memória tiszta marad.
     */
    rollback() {
        console.warn(`[V-CPU] Rolling back transaction ${this.activeTransactionId}.`);
        this.stagingBuffer.clear();
        this.unlock();
    }

    unlock() {
        this.transactionState = 'IDLE';
        this.activeTransactionId = null;
        this.stagingBuffer.clear();
    }

    // ... rest of the helper methods ...
    getSegment(address) {
        for (let key in this.segments) {
            let s = this.segments[key];
            if (address >= s.start && address <= s.end) return s;
        }
        return null;
    }

    initMemory() {
        const key = "BioOS_TITAN_2026";
        for (let i = 0; i < key.length; i++) {
            this.segments.BIO.data[i] = key.charCodeAt(i);
        }
    }

    read(address) {
        const seg = this.getSegment(address);
        if (!seg) throw new Error(`[FAULT] Invalid address: 0x${address.toString(16)}`);
        return seg.data[address - seg.start];
    }
}

export default VirtualCPU;
