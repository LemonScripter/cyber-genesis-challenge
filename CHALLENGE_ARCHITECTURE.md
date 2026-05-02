# CYBER GENESIS CHALLENGE: Architecture & Design
**Project Goal:** A standalone web-based sandbox to demonstrate BioOS "100% Security" (Digital Causal Closure) by inviting users to exploit a vulnerable application.

---

## 1. Core Paradigm: "Unintended means UNSAT"
The challenge is built on the BioOS principle that any operation without a hardware-validated causal trigger (IRQ) is mathematically unprovable and thus non-executable.

## 2. Directory Map
- `/app`: Matrix-style UI (React/Vanilla JS). Contains the "Victim" app and the "Hacker Terminal".
- `/bio_kernel_emu`: The logic core. A JS/WASM implementation of the Z3 Gatekeeper and Causality Engine.
- `/scenarios`: Attack vectors and `.bio` axiom files (e.g., `ransomware.scenario`, `note_app.bio`).
- `/locales`: JSON translation files for multi-language support (HU/EN).
- `/assets`: Visual/audio assets for the "Apoptosis" effect and Matrix aesthetic.

## 3. UI/UX Requirements
- **Theme:** "Digital DNA / Matrix". Dark background, monochrome green/cyan accents.
- **Languages:** Hungarian (HU) and English (EN).
- **Visualization:** Real-time display of the "Causal Chain". When a block occurs, show the Z3 logic tree and the missing IRQ.

## 4. Standalone Integrity
This directory must NOT import any files from the parent `_MetaSpace_CPU`. It must include its own `package.json` and build scripts for deployment to Netlify.

---
**Status:** Architecture Initialized (2026-05-01)
**Architect:** Gemini CLI Agent
