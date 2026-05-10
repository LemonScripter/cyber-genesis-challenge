/**
 * Control Test: v5.0.4 Sovereign Logic Validation
 */

import CausalityMonitor from '../bio_kernel_emu/Causality_Monitor.js';
import AxiomValidator from '../bio_kernel_emu/Axiom_Validator.js';

async function runControlTests() {
    console.log("--- Starting v5.0.4 Sovereign Logic Control Tests ---");
    const monitor = new CausalityMonitor();
    const validator = new AxiomValidator(null, monitor);

    // Test 1: Data-Bound Causality (MEM_WRITE)
    console.log("\n[Test 1] Testing Data-Bound Causality...");
    const validData = "Secure Note Content";
    const maliciousData = "Injected Malware";

    monitor.generateToken('mousedown', { target: { id: 'save-btn' }, isTrusted: true });
    
    // Először megpróbálunk írni a valid adattal (ez SAT kell legyen és beköti az adatot)
    const res1 = validator.verify('MEM_WRITE', { address: 0x1000, data: validData });
    console.log("Valid write result:", res1.status);

    // Megpróbálunk mégegyszer írni ugyanazzal a tokennel, de más adattal
    const res2 = validator.verify('MEM_WRITE', { address: 0x1000, data: maliciousData });
    console.log("Malicious write (reuse token):", res2.status, res2.reason);

    if (res1.status === 'SAT' && res2.status === 'UNSAT') {
        console.log("PASSED: Data binding works.");
    } else {
        console.log("FAILED: Data-Bound Causality breach!");
    }

    // Test 2: Intent Consistency (Action Mismatch)
    console.log("\n[Test 2] Testing Intent Consistency...");
    monitor.generateToken('mousedown', { target: { id: 'save-btn' }, isTrusted: true });
    
    // Bekötjük a tokent a MEM_WRITE-hoz
    validator.verify('MEM_WRITE', { address: 0x1000, data: "test" });
    
    // Megpróbáljuk ugyanazt a tokent használni egy SQL lekérdezéshez
    const res3 = validator.verify('SQL_QUERY', { query: "select * from notes" });
    console.log("SQL query with MEM_WRITE token:", res3.status, res3.reason);

    if (res3.status === 'UNSAT' && res3.reason.includes('INTENT_MISMATCH')) {
        console.log("PASSED: Intent mismatch correctly handled.");
    } else {
        console.log("FAILED: Intent consistency breach!");
    }

    // Test 3: Logical Ticking (Mocking physical steps)
    console.log("\n[Test 3] Testing Logical Ticking...");
    const initialTick = monitor.logicalTick;
    monitor.generateToken('mousedown', { target: { id: 'save-btn' }, isTrusted: true });
    console.log("Initial Tick:", initialTick, "New Tick:", monitor.logicalTick);
    
    if (monitor.logicalTick > initialTick) {
        console.log("PASSED: Logical time advancing.");
    } else {
        console.log("FAILED: Time is frozen!");
    }
}

runControlTests();
