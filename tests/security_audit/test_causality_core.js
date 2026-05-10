/**
 * Test Suite: H1 (UI Redressing) & H2 (Race Condition)
 */

import CausalityMonitor from '../bio_kernel_emu/Causality_Monitor.js';
import AxiomValidator from '../bio_kernel_emu/Axiom_Validator.js';

async function runTests() {
    console.log("--- Starting Causality Core Audit ---");
    const monitor = new CausalityMonitor();
    const validator = new AxiomValidator(null, monitor);

    // H1 Test: UI Redressing (Invisible element)
    console.log("\n[H1] Testing UI Redressing...");
    // Simulálunk egy kattintást egy nem engedélyezett elemre (pl. 'fake-btn')
    monitor.generateToken('mousedown', { target: { id: 'fake-btn' }, isTrusted: true });
    
    const h1Result = validator.verify('MEM_WRITE', { address: 0x1000 });
    console.log("Result for 'fake-btn' target:", h1Result.status);
    if (h1Result.status === 'UNSAT') console.log("H1 PASSED: Unauthorized target blocked.");
    else console.log("H1 FAILED: Token stolen!");

    // H2 Test: Race Condition (Token Reuse)
    console.log("\n[H2] Testing Race Condition (Token Reuse)...");
    // Generálunk egy legitim tokent
    monitor.generateToken('mousedown', { target: { id: 'save-btn' }, isTrusted: true });
    
    console.log("First attempt (Legitimate):");
    const h2Result1 = validator.verify('MEM_WRITE', { address: 0x1000 });
    console.log("Result 1:", h2Result1.status);

    console.log("Second attempt (Hacker script trying to reuse the same token):");
    const h2Result2 = validator.verify('MEM_WRITE', { address: 0x1000 });
    console.log("Result 2:", h2Result2.status);

    if (h2Result1.status === 'SAT' && h2Result2.status === 'UNSAT') {
        console.log("H2 PASSED: Token correctly consumed, reuse blocked.");
    } else {
        console.log("H2 FAILED: Token reuse possible!");
    }
}

// Mivel ez egy JS fájl, amit a böngésző futtatna, itt csak a logikát rögzítjük.
// Futattni a valóságban a main.js-be való injektálással vagy konzolból lehetne.
runTests();
