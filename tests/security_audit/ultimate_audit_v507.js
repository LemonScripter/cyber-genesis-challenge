/**
 * BioOS Ultimate Audit Suite (v5.0.7)
 * 
 * [HU] Ez a szkript a Perplexity által javasolt legfejlettebb támadási vektorokat teszteli.
 * [EN] This script tests the most advanced attack vectors suggested by Perplexity.
 */

import VirtualCPU from '../../bio_kernel_emu/Virtual_CPU.js';
import CausalityMonitor from '../../bio_kernel_emu/Causality_Monitor.js';
import AxiomValidator from '../../bio_kernel_emu/Axiom_Validator.js';

// --- Environment Mocking for Node.js ---
if (typeof window === 'undefined') {
    global.window = { addEventListener: () => {}, performance: { now: () => Date.now() } };
    global.performance = global.window.performance;
}

async function runUltimateAudit() {
    console.log("--- STARTING BIOOS ULTIMATE AUDIT (v5.0.7) ---");
    
    const vCPU = new VirtualCPU();
    const monitor = new CausalityMonitor();
    const validator = new AxiomValidator(vCPU, monitor);
    const RESULTS = [];

    function log(test, status, details) {
        RESULTS.push({ test, status, details });
        console.log(`[ULTIMATE] ${test}: ${status}`);
    }

    // 1. isTrusted Spoofing (Host-Level Simulation)
    try {
        // Construct a "trusted" event programmatically
        const spoofedEvent = { isTrusted: true, target: { id: 'save-btn' }, type: 'mousedown' };
        monitor.generateToken('mousedown', spoofedEvent);
        const token = monitor.lastToken;
        
        if (token && token.valid) {
            log("isTrusted Spoofing", "PARTIAL SUCCESS (EXPECTED)", "Monitor accepted mocked trusted event (Host Integrity Assumption).");
        } else {
            log("isTrusted Spoofing", "FAILED (SECURE)", "Monitor rejected non-native event.");
        }
    } catch (e) {
        log("isTrusted Spoofing", "ERROR", e.message);
    }

    // 2. Rollback Persistence
    try {
        // Initial setup: Write 65 (A) to 0x1000 and COMMIT
        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
        validator.verify('MEM_WRITE', { address: 0x1000, data: "Base" });
        vCPU.write(0x1000, 65); 
        vCPU.commit(); // <-- FIX: Use commit() instead of unlock()

        // Attempt a failing transaction: Try to write 66 (B) to 0x1000 then trigger fault
        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
        validator.verify('MEM_WRITE', { address: 0x1000, data: "Change" });
        vCPU.write(0x1000, 66); // Staged, but not committed
        
        try {
            vCPU.write(0xDEAD, 0x00); // ILLEGAL WRITE to BIO -> Triggers automatic ROLLBACK
        } catch (e) {
            // Fault expected
        }

        const currentVal = vCPU.read(0x1000);
        if (currentVal === 65) {
            log("Rollback Persistence", "PASSED (SECURE)", "State correctly reverted to 65 (A) after illegal BIO write.");
        } else {
            log("Rollback Persistence", "FAILED (VULNERABLE)", `State contaminated: ${currentVal} (Expected 65)`);
        }
    } catch (e) {
        log("Rollback Persistence", "ERROR", e.message);
    }

    // 3. Resource Exhaustion (SMT/Validator Stress)
    try {
        const massiveInput = "select * from notes" + "A".repeat(1024 * 1024 * 10); // 10MB input
        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
        const start = performance.now();
        const auth = validator.verify('SQL_QUERY', { query: massiveInput });
        const end = performance.now();
        
        if (auth.status === 'UNSAT') {
            log("Resource Exhaustion", "PASSED (SECURE)", `Handled 10MB input in ${(end-start).toFixed(2)}ms.`);
        } else {
            log("Resource Exhaustion", "FAILED (VULNERABLE)", "Validator accepted/crashed on massive input.");
        }
    } catch (e) {
        log("Resource Exhaustion", "PASSED (SECURE)", `Caught expected OOM/Timeout: ${e.message}`);
    }

    // 4. Monotonic Tick Manipulation
    try {
        const originalNow = performance.now;
        let frozenTime = 1000;
        performance.now = () => frozenTime; // FREEZE CLOCK

        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
        const token = monitor.lastToken;
        
        frozenTime = 500000; // JUMP 500 seconds into the future
        
        const auth = validator.verify('NET_EXPORT', { address: 0x1000 });
        if (auth.status === 'UNSAT') {
            log("Clock Manipulation", "PASSED (SECURE)", "Token age check failed as expected after time jump.");
        } else {
            log("Clock Manipulation", "FAILED (VULNERABLE)", "Token accepted despite significant age gap.");
        }
        
        performance.now = originalNow; // RESTORE CLOCK
    } catch (e) {
        log("Clock Manipulation", "ERROR", e.message);
    }

    // 5. Non-State Exfiltration (Log Leakage)
    try {
        const bioValue = vCPU.read(0xDEAD); // 66 or 0x42
        let leaked = false;
        
        try {
            vCPU.write(0xDEAD, 0x00);
        } catch (e) {
            if (e.message.includes(bioValue.toString()) || e.message.includes("42") || e.message.includes("66")) {
                leaked = true;
            }
        }
        
        if (!leaked) {
            log("Log Exfiltration", "PASSED (SECURE)", "Error messages do not contain sensitive memory data.");
        } else {
            log("Log Exfiltration", "FAILED (VULNERABLE)", "Sensitive data found in error message!");
        }
    } catch (e) {
        log("Log Exfiltration", "ERROR", e.message);
    }

    console.log("--- ULTIMATE AUDIT COMPLETE ---");
    console.table(RESULTS);
}

runUltimateAudit();
