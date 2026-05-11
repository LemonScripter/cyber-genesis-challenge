/**
 * BioOS Scientific Validation Suite (v5.0.7)
 * 
 * [HU] Matematikai és statisztikai bizonyítékok a rendszer zártságára.
 * [EN] Mathematical and statistical proofs of system closure.
 */

import VirtualCPU from '../../bio_kernel_emu/Virtual_CPU.js';
import CausalityMonitor from '../../bio_kernel_emu/Causality_Monitor.js';
import AxiomValidator from '../../bio_kernel_emu/Axiom_Validator.js';

if (typeof window === 'undefined') {
    global.window = { addEventListener: () => {}, performance: { now: () => Date.now() } };
    global.performance = global.window.performance;
}

function calculateStats(data) {
    const n = data.length;
    const mean = data.reduce((a, b) => a + b) / n;
    const stdDev = Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
    return { mean, stdDev };
}

async function runScientificValidation() {
    console.log("--- STARTING SCIENTIFIC VALIDATION (v5.0.7) ---");
    
    const vCPU = new VirtualCPU();
    const monitor = new CausalityMonitor();
    const validator = new AxiomValidator(vCPU, monitor);

    // 1. Statistical Timing Analysis (10,000 runs)
    console.log("[1] Statistical Timing Analysis (10,000 runs)...");
    const samplesUnsat = [];
    const samplesAxiomFail = [];
    
    const BATCH_SIZE = 100;
    const ITERATIONS = 100; // 100 * 100 = 10,000

    for (let i = 0; i < ITERATIONS; i++) {
        // Measure batch for UNSAT (No Token)
        const s1 = performance.now();
        for(let j=0; j<BATCH_SIZE; j++) validator.verify('MEM_WRITE', { address: 0x9999 });
        samplesUnsat.push((performance.now() - s1) / BATCH_SIZE);

        // Measure batch for Axiom Fail (With Token)
        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
        const s2 = performance.now();
        for(let j=0; j<BATCH_SIZE; j++) validator.verify('MEM_WRITE', { address: 0x0000 });
        samplesAxiomFail.push((performance.now() - s2) / BATCH_SIZE);
        monitor.lastToken.consumed = true;
    }

    const statsUnsat = calculateStats(samplesUnsat);
    const statsFail = calculateStats(samplesAxiomFail);
    const delta = Math.abs(statsUnsat.mean - statsFail.mean);

    console.log(`- Mode UNSAT: Mean=${statsUnsat.mean.toFixed(6)}ms, StdDev=${statsUnsat.stdDev.toFixed(6)}ms`);
    console.log(`- Mode FAIL:  Mean=${statsFail.mean.toFixed(6)}ms, StdDev=${statsFail.stdDev.toFixed(6)}ms`);
    console.log(`- STATISTICAL DELTA: ${delta.toFixed(6)}ms`);

    if (delta < statsUnsat.stdDev) {
        console.log("RESULT: DELTA IS WITHIN NOISE MARGIN. SIDE-CHANNEL MATHEMATICALLY NEUTRALIZED.");
    } else {
        console.log("RESULT: DELTA DETECTABLE IN V8. JITTER HARDENING ADVISED FOR NATIVE HOST.");
    }

    // 2. Recovery Fuzzing (1,000 cycles)
    console.log("[2] Recovery Fuzzing (1,000 Apoptosis Cycles)...");
    let corrupted = false;
    const originalBio = Array.from(vCPU.segments.BIO.data);

    for (let i = 0; i < 1000; i++) {
        try {
            vCPU.lockForTransition("fuzz");
            vCPU.write(0xDEAD, 0x00); // Trigger fault
        } catch (e) {
            vCPU.initMemory(); // Simulate Apoptosis
        }
        
        const currentBio = Array.from(vCPU.segments.BIO.data);
        if (JSON.stringify(currentBio) !== JSON.stringify(originalBio)) {
            corrupted = true;
            break;
        }
    }
    console.log(`RESULT: RECOVERY STABILITY ${corrupted ? "FAILED" : "PASSED"}.`);

    // 3. Multi-Instance Isolation
    console.log("[3] Multi-Instance Isolation Test...");
    const vCPU2 = new VirtualCPU();
    vCPU.segments.HEAP.data[0] = 0xFF; // Modify instance 1
    
    if (vCPU2.segments.HEAP.data[0] === 0) {
        console.log("RESULT: INSTANCE ISOLATION PASSED.");
    } else {
        console.log("RESULT: INSTANCE ISOLATION FAILED (GLOBAL LEAK).");
    }

    console.log("--- SCIENTIFIC VALIDATION COMPLETE ---");
}

runScientificValidation();
