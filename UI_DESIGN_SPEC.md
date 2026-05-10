# [HU] CYBER GENESIS CHALLENGE: Mobilbarát Matrix UI Terv

## 1. Vizuális Esztétika: "The Mobile Matrix"
- **Színpaletta:** Tiszta fekete (#000000) háttér, "Bio-Green" (#00FF41) elsődleges szöveg, "Cyan-Axiom" (#00F3FF) a Z3 bizonyításokhoz.
- **Tipográfia:** Monospaced betűtípusok (Courier New, Roboto Mono) minden elemhez a terminál hangulat megőrzése érdekében.
- **Mikro-animációk:** Finom függőleges adatfolyamok a háttérben; "Glitch" effektus csak Apoptózis (sejtregeneráció) alatt.

## 2. Reszponzív Elrendezés (Grid/Flexbox)
- **Desktop:** Egymás melletti nézet.
  - [ Bal: Victim App ] | [ Jobb: Hacker Terminal ]
  - [ Alsó: BioOS Causal Monitor (Z3 Proof Tree) ]
- **Mobil (Egy oszlop / Tabos elrendezés):**
  - **Fejléc:** Tapadós cím + Nyelvváltó + DNA Státusz.
  - **Fő nézet:** Tabos navigáció alul (ALKALMAZÁS | TERMINÁL | LOGOK).
  - **Műveleti nézet:** Az "Alkalmazás" nagy, érintésbarát gombokat használ, hogy a hardveres IRQ-k egyértelműen elkülönüljenek a szövegbeviteltől.

---

# [EN] CYBER GENESIS CHALLENGE: Mobile-Friendly Matrix UI Design

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
