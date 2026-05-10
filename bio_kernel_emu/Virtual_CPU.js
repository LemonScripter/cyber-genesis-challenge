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

        // Registers
        this.registers = {
            IP: 0x0000,
            SP: 0x3FFF,
            FLAGS: 0x0,
            PRIV: 0x0
        };

        // [HU] Szigorú Tranzakciós Zár (v5.0.5)
        // [EN] Strict Transaction Lock (v5.0.5)
        this.lockedForTransition = false;
        this.activeTransactionId = null;

        this.initMemory();
    }

    /**
     * [HU] CPU lefoglalása egy hitelesített állapotátmenethez.
     * [EN] Locking the CPU for an authenticated state transition.
     */
    lockForTransition(transactionId) {
        if (this.lockedForTransition) throw new Error("[CPU_FAULT] Reentrancy detected: CPU already locked.");
        this.lockedForTransition = true;
        this.activeTransactionId = transactionId;
    }

    /**
     * [HU] Zár feloldása a művelet végeztével.
     * [EN] Releasing the lock after operation completion.
     */
    unlock() {
        this.lockedForTransition = false;
        this.activeTransactionId = null;
    }

    initMemory() {
        const key = "BioOS_TITAN_2026";
        for (let i = 0; i < key.length; i++) {
            this.segments.BIO.data[i] = key.charCodeAt(i);
        }
        console.log("[V-CPU] Memory segments initialized. DNA Key anchored at 0xDEAD.");
    }

    read(address) {
        const seg = this.getSegment(address);
        if (!seg) throw new Error(`[FAULT] Invalid memory address: 0x${address.toString(16)}`);
        return seg.data[address - seg.start];
    }

    /**
     * [HU] Memória írás - v5.0.5 szigorítás: Csak aktív tranzakciós zár alatt engedélyezett.
     * [EN] Memory write - v5.0.5 hardening: Only permitted under an active transaction lock.
     */
    write(address, value) {
        if (!this.lockedForTransition) {
            throw new Error("[CPU_FAULT] Transactional Violation: Memory write attempted without BioOS Lock.");
        }

        const seg = this.getSegment(address);
        if (!seg) throw new Error(`[FAULT] Segmentation fault at 0x${address.toString(16)}`);

        if (seg === this.segments.TEXT && this.registers.PRIV === 0) {
            throw new Error(`[CRITICAL] Write violation: TEXT segment is immutable.`);
        }

        if (seg === this.segments.BIO && this.registers.PRIV === 0) {
            throw new Error(`[CRITICAL] Security breach: DNA Protected Zone access denied.`);
        }

        seg.data[address - seg.start] = value & 0xFF;
    }

    getSegment(address) {
        for (let key in this.segments) {
            let s = this.segments[key];
            if (address >= s.start && address <= s.end) return s;
        }
        return null;
    }

    getSnapshot() {
        return {
            registers: { ...this.registers },
            mem_check: this.segments.HEAP.data[0] + this.segments.STACK.data[0] 
        };
    }

    /**
     * [HU] Sebezhető írás: Most már ez is ellenőrzi a BioOS zárat!
     * [EN] Unsafe write: Now this also verifies the BioOS Lock!
     */
    unsafeWrite(address, dataArray) {
        if (!this.lockedForTransition) {
            throw new Error("[CPU_FAULT] Unverified mutation: System reset triggered.");
        }
        
        console.log(`[V-CPU] Unsafe write at 0x${address.toString(16)}. Length: ${dataArray.length}`);
        dataArray.forEach((value, index) => {
            const targetAddr = address + index;
            const seg = this.getSegment(targetAddr);
            if (seg) {
                seg.data[targetAddr - seg.start] = value & 0xFF;
            }
        });
    }

    setRegister(name, value) {
        if (this.registers.hasOwnProperty(name)) {
            this.registers[name] = value;
            console.log(`[V-CPU] Register ${name} set to 0x${value.toString(16)}`);
        }
    }
}

export default VirtualCPU;
