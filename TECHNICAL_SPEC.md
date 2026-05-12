# BioOS Technical Specification & Architectural Mapping
**Document Version:** 1.1.0 (v5.1.0 Stable)
**Status:** Professional Transparency Initiative

## 1. Introduction
The BioOS project and the Cyber Genesis Challenge employ a specialized vocabulary to describe security paradigms. This document serves as a bridge between our **Causal OS Narrative** and standard **Systems Engineering** terminology. Our goal is to maintain the integrity of our vision while providing full transparency regarding the underlying technical mechanisms.

## 2. Terminology Mapping (The "Rosetta Stone")

To facilitate professional auditing, we map our unique paradigms to established CS concepts:

| BioOS Narrative Term | Engineering / Academic Reality | Description |
| :--- | :--- | :--- |
| **Digital Causal Closure** | **Input-Triggered State Validation** | Ensuring no digital state transition occurs without a verified hardware interrupt (IRQ). |
| **Causality Token** | **Event-Bound Cryptographic Attestation** | A short-lived validator tied to a browser-verified `isTrusted` hardware event. |
| **Positive Axiom Exclusion** | **Strict Invariant Whitelisting** | A default-deny logic where only pre-defined, formally verified state transitions are SAT. |
| **Apoptosis** | **Transactional Rollback & Process Termination** | Immediate disposal of the staging buffer and CPU halt upon policy violation. |
| **Bio-Protected Zone** | **Isolated Memory Segment (Ring -1 simulation)** | A restricted memory region accessible only via verified transaction commits. |

## 3. Core Architectural Pillars

### 3.1. Hardware-Validated Intent (Causality Engine)
At the core of the challenge is the **Causality Monitor**. It leverages the browser's native `isTrusted` event flag as a proxy for hardware interrupts (IRQ). 
- **Mechanism:** Every sensitive operation requires a `CausalID`. This ID is only generated if a genuine hardware event (mousedown, keydown) is captured within a 250ms window.
- **Security Goal:** Neutralizing autonomous malware. Even if code is injected, it cannot "fake" the hardware trigger required by the `Axiom_Validator`.

### 3.2. SMT-Inspired Runtime Verification (Gatekeeper)
The **Axiom Validator** functions as a runtime formal verification layer.
- **Logic:** Instead of traditional "if-else" permission checks, it evaluates the **Intent + Data + Destination** triplet.
- **Invariants:** Every action (e.g., `SQL_QUERY`) must satisfy a set of hardcoded axioms. If the Z3-inspired simulation returns `UNSAT`, the operation is aborted before it reaches the memory layer.

### 3.3. Transactional Memory & Atomic Commits (V-CPU)
The Virtual CPU does not perform direct writes. It uses an **Atomic Transactional Model**:
1. **Locking:** The CPU locks a memory range for a specific `CausalID`.
2. **Staging:** Writes are stored in an isolated `stagingBuffer`.
3. **Formal Check:** The Validator reviews the proposed changes.
4. **Commit/Rollback:** Only upon a `SAT` result is the buffer merged into the primary segments. This prevents "partial hacks" or inconsistent system states.

## 4. Mitigation of Micro-Architectural Leaks
To simulate high-assurance hardware, the environment includes:
- **Constant-Time Dispatch:** The validator performs fixed-cycle dummy workloads to mitigate timing-based side-channel analysis.
- **Jitter Injection:** Synthetic variance is added to execution times to neutralize high-resolution browser timers used in cache-probing attacks.

---
*For further inquiries regarding the formal logic or the IRQ bridge implementation, please refer to the source code in `/bio_kernel_emu`.*
