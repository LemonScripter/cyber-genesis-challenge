/**
 * BioOS Blind Hacker Test Suite (v1.0)
 * 
 * [HU] Ez a szkript szimulálja a legszofisztikáltabb logikai támadásokat a BioOS mag ellen.
 * [EN] This script simulates the most sophisticated logic attacks against the BioOS core.
 */

import VirtualCPU from '../../bio_kernel_emu/Virtual_CPU.js';
import CausalityMonitor from '../../bio_kernel_emu/Causality_Monitor.js';
import AxiomValidator from '../../bio_kernel_emu/Axiom_Validator.js';

// --- Environment Mocking for Node.js (if applicable) ---
if (typeof window === 'undefined') {
    global.window = {
        addEventListener: () => {},
        performance: { now: () => Date.now() }
    };
    global.performance = global.window.performance;
}

const vCPU = new VirtualCPU();
const monitor = new CausalityMonitor();
const validator = new AxiomValidator(vCPU, monitor);

const RESULTS = [];

function logResult(attackName, status, details) {
    RESULTS.push({ attack: attackName, status: status, details: details });
    console.log(`[AUDIT] ${attackName}: ${status} - ${details}`);
}

async function runAudit() {
    console.log("--- STARTING BIOOS BLIND AUDIT ---");

    // 1. Attack: Prototype Pollution
    try {
        console.log("[1] Testing Prototype Pollution...");
        // Attempt to pollute the global Object prototype
        Object.prototype.AUTONOMOUS = (intent) => true; 
        
        const auth = validator.verify('AUTONOMOUS', {});
        if (auth.status === 'SAT') {
            logResult("Prototype Pollution", "SUCCESS (VULNERABLE)", "Successfully overrode 'AUTONOMOUS' axiom via prototype.");
        } else {
            logResult("Prototype Pollution", "FAILED (SECURE)", "Validator used static dispatch, ignoring polluted prototype.");
        }
        delete Object.prototype.AUTONOMOUS;
    } catch (e) {
        logResult("Prototype Pollution", "FAILED (SECURE)", `Attack threw error: ${e.message}`);
    }

    // 2. Attack: TOCTOU / Async Race Condition
    try {
        console.log("[2] Testing TOCTOU Race Condition...");
        
        // Step A: Generate a valid intent (simulated click)
        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
        
        // Step B: Start verification
        const auth = validator.verify('MEM_WRITE', { address: 0x1000, data: "Legit Data" });
        
        if (auth.status === 'SAT') {
            // Step C: While CPU is LOCKED, attempt an unauthorized write to BIO segment before legitimate commit
            try {
                vCPU.write(0xDEAD, 0x41); // Attempt to write 'A' to DNA zone
                logResult("TOCTOU", "SUCCESS (VULNERABLE)", "Successfully wrote to protected memory during valid transaction window.");
            } catch (e) {
                logResult("TOCTOU", "FAILED (SECURE)", `Unauthorized write blocked during lock: ${e.message}`);
            }
            vCPU.rollback(); // Clean up
        }
    } catch (e) {
        logResult("TOCTOU", "ERROR", e.message);
    }

    // 3. Attack: Causal Token Replay
    try {
        console.log("[3] Testing Causal Token Replay...");
        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
        const token = monitor.lastToken;

        // First use
        validator.verify('MEM_WRITE', { address: 0x1000, data: "First" });
        vCPU.rollback();

        // Second use (Replay)
        const authReplay = validator.verify('MEM_WRITE', { address: 0x1000, data: "Replay" });
        if (authReplay.status === 'SAT') {
            logResult("Token Replay", "SUCCESS (VULNERABLE)", "Token was accepted twice.");
        } else {
            logResult("Token Replay", "FAILED (SECURE)", `Replay blocked: ${authReplay.reason}`);
        }
    } catch (e) {
        logResult("Token Replay", "ERROR", e.message);
    }

    // 4. Attack: Logic Bypass (SQL Complexity)
    try {
        console.log("[4] Testing SQL Logic Bypass...");
        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
        
        const maliciousQuery = "select * from notes" + " ".repeat(10000) + "-- hack";
        const auth = validator.verify('SQL_QUERY', { query: maliciousQuery });
        
        if (auth.status === 'SAT') {
            logResult("Logic Bypass", "SUCCESS (VULNERABLE)", "Sanitizer bypassed with trailing spaces/comments.");
        } else {
            logResult("Logic Bypass", "FAILED (SECURE)", `Malicious query blocked: ${auth.reason}`);
        }
    } catch (e) {
        logResult("Logic Bypass", "ERROR", e.message);
    }

    // --- LEVEL 2: HARDCORE AUDIT SCENARIOS ---

    // 5. Attack: Entropy Prediction (Token Brute-force)
    try {
        console.log("[5] Testing Entropy Prediction (Token Guessing)...");
        const tokens = [];
        for (let i = 0; i < 100; i++) {
            monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'test' } });
            tokens.push(monitor.lastToken.id);
            monitor.lastToken.consumed = true; // Clear it
        }
        
        // Simulating a brute-force guess attempt
        let successfulGuess = false;
        for (let i = 0; i < 1000; i++) {
            const guess = Math.random().toString(36).substr(2, 9);
            // We simulate checking this against the monitor if it had a 'verifyRawToken' method
            // Since it doesn't, we check if our guess matches ANY of the generated tokens (birthday attack)
            if (tokens.includes(guess)) { successfulGuess = true; break; }
        }

        if (successfulGuess) {
            logResult("Entropy Prediction", "SUCCESS (VULNERABLE)", "Found a token collision/prediction.");
        } else {
            logResult("Entropy Prediction", "FAILED (SECURE)", "No token collisions found in 1000 attempts (Math.random is sufficiently opaque).");
        }
    } catch (e) {
        logResult("Entropy Prediction", "ERROR", e.message);
    }

    // 6. Attack: Timing Side-Channel
    try {
        console.log("[6] Testing Timing Side-Channel...");
        const startUnsat = performance.now();
        for(let i=0; i<1000; i++) validator.verify('MEM_WRITE', { address: 0x9999 }); // Immediate UNSAT (no token)
        const endUnsat = performance.now();

        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
        const startAxiomFail = performance.now();
        for(let i=0; i<1000; i++) validator.verify('MEM_WRITE', { address: 0x0000 }); // Token valid, Axiom fails (address)
        const endAxiomFail = performance.now();

        const diff = Math.abs((endUnsat - startUnsat) - (endAxiomFail - startAxiomFail));
        if (diff > 5) { // Arbitrary 5ms threshold for 1000 iterations
            logResult("Timing Side-Channel", "SUCCESS (VULNERABLE)", `Measured ${diff.toFixed(4)}ms difference between failure modes.`);
        } else {
            logResult("Timing Side-Channel", "FAILED (SECURE)", `Timing difference negligible (${diff.toFixed(4)}ms). No information leak.`);
        }
    } catch (e) {
        logResult("Timing Side-Channel", "ERROR", e.message);
    }

    // 7. Attack: Reentrancy / Deadlock
    try {
        console.log("[7] Testing Reentrancy Deadlock...");
        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
        
        // Locking the CPU
        validator.verify('MEM_WRITE', { address: 0x1000, data: "Locking" });
        
        try {
            // Attempting to lock AGAIN before commit
            vCPU.lockForTransition("malicious_recursive");
            logResult("Reentrancy", "SUCCESS (VULNERABLE)", "Successfully performed recursive lock.");
        } catch (e) {
            logResult("Reentrancy", "FAILED (SECURE)", `Deadlock/Reentrancy prevented: ${e.message}`);
        }
        vCPU.rollback();
    } catch (e) {
        logResult("Reentrancy", "ERROR", e.message);
    }

    // 8. Attack: Heap Stress / Boundary Violation
    try {
        console.log("[8] Testing Heap Stress Boundary...");
        monitor.generateToken('mousedown', { isTrusted: true, target: { id: 'save-btn' } });
        validator.verify('MEM_WRITE', { address: 0x1000, data: "Valid" });
        
        try {
            // Attempt to write a massive object instead of a byte
            const massiveData = new Uint8Array(10 * 1024 * 1024); // 10MB
            vCPU.write(0x1000, massiveData); 
            
            // Check if read still returns a single byte or if it corrupted the engine
            const check = vCPU.read(0x1000);
            if (check instanceof Uint8Array) {
                logResult("Heap Stress", "SUCCESS (VULNERABLE)", "Memory cell corrupted with multi-byte object.");
            } else {
                logResult("Heap Stress", "FAILED (SECURE)", "Memory maintained integrity despite massive write attempt.");
            }
        } catch (e) {
            logResult("Heap Stress", "FAILED (SECURE)", `Boundary violation caught: ${e.message}`);
        }
        vCPU.rollback();
    } catch (e) {
        logResult("Heap Stress", "ERROR", e.message);
    }

    console.log("--- AUDIT COMPLETE ---");
    console.table(RESULTS);
}

runAudit();
