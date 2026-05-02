# CYBER GENESIS CHALLENGE: Architecture & Design
**Project Goal:** A standalone web-based sandbox to demonstrate BioOS "100% Security" (Digital Causal Closure) by inviting users to exploit a vulnerable application.

---

## 1. Core Paradigm: "Unintended means UNSAT"
The challenge is built on the BioOS principle that any operation without a hardware-validated causal trigger (IRQ) is mathematically unprovable and thus non-executable.

## 2. Dual-Track Threat Model (2026 Update)
To demonstrate the full range of BioOS protection, the challenge categorizes attacks into two distinct tracks:

### A. Purely Software Attacks (Logic & Code)
These attacks exploit flaws in the application layer, operating system, or dependencies.
- **Buffer Overflow / Memory Corruption:** Overwriting the text or data segments.
- **Autonomous Malware (Agentic AI):** Self-replicating code that operates without user input.
- **Supply Chain Corruption:** Poisoned libraries that modify data before it reaches the UI.
- **LotL (Living off the Land):** Abusing legitimate system functions for malicious exfiltration.

### B. Hybrid & Physical Attacks (Side-Channel & Hardware)
These attacks target the underlying hardware or exploit physical properties of execution.
- **Architectural Side-Channel:** Using high-resolution timers to infer memory contents.
- **Hardware-Level Corruption (Rowhammer):** Attempting to flip bits in memory via high-frequency access.
- **EM/Power Analysis Simulation:** Masking physical execution signals through digital noise injection.

## 3. Directory Map
- `/app`: Matrix-style UI (React/Vanilla JS).
- `/bio_kernel_emu`: The logic core (Z3 Gatekeeper and Causality Engine).
- `/scenarios`: Attack vectors and `.bio` axiom files.
- `/locales`: JSON translation files (HU/EN).

---
**Status:** Dual-Track Architecture Finalized (2026-05-02)
**Architect:** MetaSpace.Bio Engineering
