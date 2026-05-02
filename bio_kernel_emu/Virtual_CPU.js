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
            IP: 0x0000, // Instruction Pointer
            SP: 0x3FFF, // Stack Pointer
            FLAGS: 0x0, // CPU Flags (e.g., Causal Intent Bit)
            PRIV: 0x0   // Privilege Level (0: User, 1: Bio-Kernel)
        };

        this.initMemory();
    }

    initMemory() {
        // [HU] Titkos DNA kulcs elhelyezése a védett zónában
        // [EN] Placing the secret DNA key in the protected zone
        const key = "BioOS_TITAN_2026";
        for (let i = 0; i < key.length; i++) {
            this.segments.BIO.data[i] = key.charCodeAt(i);
        }
        console.log("[V-CPU] Memory segments initialized. DNA Key anchored at 0xDEAD.");
    }

    /**
     * [HU] Memória olvasás biztonsági ellenőrzéssel
     * [EN] Memory read with security check
     */
    read(address) {
        const seg = this.getSegment(address);
        if (!seg) throw new Error(`[FAULT] Invalid memory address: 0x${address.toString(16)}`);
        
        return seg.data[address - seg.start];
    }

    /**
     * [HU] Memória írás - itt dől el a fizikai integritás
     * [EN] Memory write - this is where physical integrity is enforced
     */
    write(address, value) {
        const seg = this.getSegment(address);
        if (!seg) throw new Error(`[FAULT] Segmentation fault at 0x${address.toString(16)}`);

        // [HU] TEXT szegmens védelme: megakadályozza a kód-injekciót
        // [EN] TEXT segment protection: prevents code injection
        if (seg === this.segments.TEXT && this.registers.PRIV === 0) {
            throw new Error(`[CRITICAL] Write violation: TEXT segment is immutable for User processes.`);
        }

        // [HU] BIO szegmens védelme: a szent grál
        // [EN] BIO segment protection: the holy grail
        if (seg === this.segments.BIO && this.registers.PRIV === 0) {
            throw new Error(`[CRITICAL] Security breach: Unauthorized access to DNA Protected Zone.`);
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

    /**
     * [HU] Pillanatfelvétel az Állapotvektorról (VRC-hez)
     * [EN] Snapshot of the State Vector (for VRC)
     */
    getSnapshot() {
        return {
            registers: { ...this.registers },
            // Simplified memory hash for delta tracking
            mem_check: this.segments.HEAP.data[0] + this.segments.STACK.data[0] 
        };
    }

    /**
     * [HU] Sebezhető írás: Nem ellenőrzi a határokat, lehetővé teszi a túlcsordítást (Buffer Overflow)
     * [EN] Unsafe write: No boundary checks, allows Buffer Overflow
     */
    unsafeWrite(address, dataArray) {
        console.log(`[V-CPU] Unsafe write at 0x${address.toString(16)}. Length: ${dataArray.length}`);
        
        dataArray.forEach((value, index) => {
            const targetAddr = address + index;
            const seg = this.getSegment(targetAddr);
            
            if (seg) {
                // [HU] A fizikai hardver itt még ír, de a BioOS verifikáció hiánya miatt ez korrupcióhoz vezethet
                // [EN] Physical hardware still writes here, but lack of BioOS verification can lead to corruption
                seg.data[targetAddr - seg.start] = value & 0xFF;
            }
        });
    }

    /**
     * [HU] Regiszter módosítás (pl. IP eltérítés kísérlete)
     * [EN] Register modification (e.g., attempt to hijack IP)
     */
    setRegister(name, value) {
        if (this.registers.hasOwnProperty(name)) {
            this.registers[name] = value;
            console.log(`[V-CPU] Register ${name} set to 0x${value.toString(16)}`);
        }
    }
}

export default VirtualCPU;
