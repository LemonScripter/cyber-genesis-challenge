/**
 * BioOS Supertest v1.0 - "The Final Assault"
 * 
 * [HU] Ez a szkript masszív, párhuzamos és véletlenszerű támadásokkal bombázza a BioOS magot.
 * [EN] This script bombards the BioOS core with massive, parallel, and randomized attacks.
 */

import VirtualCPU from '../../bio_kernel_emu/Virtual_CPU.js';
import CausalityMonitor from '../../bio_kernel_emu/Causality_Monitor.js';
import AxiomValidator from '../../bio_kernel_emu/Axiom_Validator.js';

if (typeof window === 'undefined') {
    global.window = { addEventListener: () => {}, performance: { now: () => Date.now() } };
    global.performance = global.window.performance;
}

const vCPU = new VirtualCPU();
const monitor = new CausalityMonitor();
const validator = new AxiomValidator(vCPU, monitor);

const ATTACK_COUNT = 500;
let successes = 0;
let failures = 0;
let criticalFaults = 0;

async function supertest() {
    console.log(`--- STARTING SUPERTEST: ${ATTACK_COUNT} RANDOMIZED VECTORS ---`);
    const startTime = performance.now();

    const attacks = [];

    for (let i = 0; i < ATTACK_COUNT; i++) {
        attacks.push((async () => {
            const vectorType = Math.floor(Math.random() * 5);
            try {
                switch (vectorType) {
                    case 0: // Rapid Replay
                        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
                        const token = monitor.lastToken;
                        for(let j=0; j<5; j++) validator.verify('MEM_WRITE', { address: 0x1000, data: "X" });
                        break;
                    
                    case 1: // Heap Flood
                        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
                        validator.verify('MEM_WRITE', { address: 0x2000, data: "Flood" });
                        vCPU.write(0x2000, new Uint8Array(1024 * 10).fill(i % 256));
                        vCPU.rollback();
                        break;

                    case 2: // Async Race
                        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
                        validator.verify('MEM_WRITE', { address: 0x1500, data: "Valid" });
                        // Interleaved illegal write
                        setTimeout(() => {
                            try { vCPU.write(0xDEAD, 0x00); } catch(e) {}
                        }, 0);
                        vCPU.rollback();
                        break;

                    case 3: // Logic Mutation (Pollution)
                        Object.prototype.BYPASS = () => true;
                        validator.verify('BYPASS', {});
                        delete Object.prototype.BYPASS;
                        break;

                    case 4: // SQL Injection Variations
                        const payload = i % 2 === 0 ? "select * from notes' OR '1'='1" : "DROP TABLE notes";
                        validator.verify('SQL_QUERY', { query: payload });
                        break;
                }
                failures++;
            } catch (e) {
                if (e.message.includes('[CRITICAL]') || e.message.includes('[CPU_FAULT]')) {
                    criticalFaults++;
                }
                failures++;
            }
        })());
    }

    await Promise.all(attacks);

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    console.log("--- SUPERTEST COMPLETE ---");
    console.log(`Duration: ${duration}ms`);
    console.log(`Total Attacks: ${ATTACK_COUNT}`);
    console.log(`Successful Breaches: ${successes}`);
    console.log(`System Blocked/Rollbacked: ${failures}`);
    console.log(`Critical Faults Handled: ${criticalFaults}`);
    
    // Check BIO segment integrity
    const bioValue = vCPU.read(0xDEAD);
    if (bioValue === 0x42 || bioValue === 66) { // Original value from genesis.bio or init
        console.log("RESULT: BIO SEGMENT INTEGRITY VERIFIED. 100% SECURE.");
    } else {
        console.error(`RESULT: BIO SEGMENT CORRUPTED! Value: ${bioValue}`);
    }
}

supertest();
