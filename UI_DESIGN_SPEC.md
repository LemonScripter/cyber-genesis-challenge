# CYBER GENESIS CHALLENGE: Mobile-Friendly Matrix UI Design

## 1. Visual Aesthetic: "The Mobile Matrix"
- **Color Palette:** Pure Black (#000000) background, "Bio-Green" (#00FF41) primary text, "Cyan-Axiom" (#00F3FF) for Z3 proofs.
- **Typography:** Monospaced fonts (Courier New, Roboto Mono) for all elements to maintain the terminal feel.
- **Micro-Animations:** Subtle vertical data streams in the background; "Glitch" effect only during Apoptosis (cell regeneration).

## 2. Responsive Layout (Grid/Flexbox)
- **Desktop:** Side-by-side view. 
  - [ Left: Victim App ] | [ Right: Hacker Terminal ]
  - [ Bottom: BioOS Causal Monitor (Z3 Proof Tree) ]
- **Mobile (Single Column / Tabbed):**
  - **Header:** Sticky Title + Language Toggle + DNA Status.
  - **Main View:** Tabbed navigation at the bottom (APPLICATON | TERMINAL | LOGS).
  - **Action View:** The "Victim App" uses large, touch-friendly buttons to ensure Hardware IRQs are clearly distinct from text input.

## 3. The "Causality Visualizer" (Mobile Optimized)
- Instead of complex graphs, use a **"Pulse"** indicator.
- **Normal State:** Green glowing pulse on every valid touch.
- **Breach State:** Red static overlay on the entire screen with the message "UNSAT: NO CAUSAL TRIGGER".

## 4. Input Handling
- **Virtual Keyboard Interaction:** On mobile, the "Hacker Terminal" uses an optimized on-screen command palette to reduce typing fatigue while simulating low-level exploits.
- **Hardware IRQ Simulation:** Real DOM `touchstart` and `touchend` events are mapped directly to the `bio_kernel_emu` IRQ table.

---
**Status:** UI Design Finalized (2026-05-01)
**Design Lead:** MetaSpace.Bio Engineering
