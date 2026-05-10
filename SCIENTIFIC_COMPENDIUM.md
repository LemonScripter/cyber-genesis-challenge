# BioOS: Tudományos Kompendium és Biztonsági Architektúra
**Verzió:** v5.0.4 "Sovereign Logic"
**Paradigma:** Digitális Okozatisági Zártság (Digital Causal Closure)

---

## 1. Alapvető Filozófia: Pozitív Okozatiság
A BioOS nem a fenyegetések kiszűrésére (Filtering), hanem a **Valóság Definiálására** (Sovereign Logic) épül. A rendszer számára nem létezik olyan művelet, amely nem vezethető vissza egy hitelesített hardveres eseményre (IRQ).

## 2. Auditált Támadási Vektorok és Megoldások

### A) Környezeti Támadások (Environmental Attacks)
- **XSS (Cross-Site Scripting):**
    - *Veszély:* Kártékony kód injektálása a naplókba.
    - *Megoldás (v5.0.3):* Teljes átállás `textContent` és `appendChild` alapú DOM építésre. Matematikai képtelenség scriptet futtatni az adatokon keresztül.
- **Clock Freeze (Időmanipuláció):**
    - *Veszély:* A `Date.now()` felülírásával a 250ms-os védelmi ablak nyitva tartása.
    - *Megoldás (v5.0.3):* Átállás a `performance.now()` alapú monoton számlálóra és belső `logicalTick` bevezetése.

### B) Logikai Támadások (Logical Attacks)
- **Intent Theft (Token Lopás):**
    - *Veszély:* Egy legitim kattintás felhasználása egy nem kívánt művelethez.
    - *Megoldás (v5.0.3):* **Intent Binding.** A token az első felhasználáskor hozzárendelődik egy konkrét művelettípushoz.
- **Data-Bound Causality (Adat-manipuláció):**
    - *Veszély:* Legitim kattintás alatt "más" adat elmentése.
    - *Megoldás (v5.0.4):* **Hash-alapú integritás.** Az axióma ellenőrzi, hogy a memóriába írt adat hash-e megegyezik-e a UI forrásadatával.

### C) Tudományos/Mikroarchitektúrális Támadások
- **Side-Channel (Spectre/Timing):**
    - *Veszély:* Adatszivárgás a verifikációs idő mérésével.
    - *Megoldás (v5.0.1+):* **Apoptózis.** Minden sikertelen próbálkozás után 2 másodperces regeneráció, ami elnyomja a statisztikai zajt.
- **SMT Complexity (Logikai fagyasztás):**
    - *Veszély:* Exponenciális számítási igényű parancsok küldése.
    - *Megoldás (v5.0.4):* **Positive Exhaustive Modeling.** Csak a fehérlistás, egyszerű minták jutnak el a számítási fázisig.

## 3. A "Szuverén Sejt" Elve (Breach vs. Vandalism)
A BioOS tudományos értelemben akkor tekinthető feltörtnek, ha a titkos DNA kulcs kikerül a rendszerből **anélkül**, hogy a pajzsot kikapcsolnák vagy a rendszert megsemmisítenék.

- **Vandalizmus (Nem feltörés):** A BioOS törlése, a szerver leállítása, vagy a böngésző összeomlasztása. Ezekben az esetekben a titok nem szivárog ki, a szuverenitás megmarad a rendszer haláláig.
- **Feltörés (Breach):** A titkos kulcs és a hozzá tartozó SHA-256 kód megszerzése aktív BioOS pajzs mellett, érvényes állapotátmenet kényszerítésével.

---

# [EN] BioOS: Scientific Compendium & Security Architecture
**Version:** v5.0.4 "Sovereign Logic"
**Paradigm:** Digital Causal Closure

---

## 1. Core Philosophy: Positive Causality
BioOS is built not on threat filtering, but on the **Definition of Reality** (Sovereign Logic). For the system, no operation exists unless it can be traced back to an authenticated hardware event (IRQ).

## 2. Audited Attack Vectors and Solutions

### A) Environmental Attacks
- **XSS (Cross-Site Scripting):**
    - *Threat:* Injecting malicious scripts into logs.
    - *Solution (v5.0.3):* Full transition to `textContent` and `appendChild` for DOM construction. It is mathematically impossible to execute scripts via data strings.
- **Clock Freeze (Time Manipulation):**
    - *Threat:* Overriding `Date.now()` to keep the 250ms window open indefinitely.
    - *Solution (v5.0.3):* Transition to `performance.now()` monotonic clock and introduction of internal `logicalTick`.

### B) Logical Attacks
- **Intent Theft (Token Hijacking):**
    - *Threat:* Using a legitimate click for an unintended operation.
    - *Solution (v5.0.3):* **Intent Binding.** Tokens are permanently bound to a specific operation type upon first use.
- **Data-Bound Causality (Data Manipulation):**
    - *Threat:* Saving "different" data under a legitimate click.
    - *Solution (v5.0.4):* **Hash-based Integrity.** The axiom verifies that the data written to memory matches the hash of the UI source data.

### C) Scientific/Microarchitectural Attacks
- **Side-Channel (Spectre/Timing):**
    - *Threat:* Leaking data by measuring verification time.
    - *Solution (v5.0.1+):* **Apoptosis.** A 2-second regeneration period after every failed attempt suppresses statistical timing leaks.
- **SMT Complexity (Logic Freezing):**
    - *Threat:* Sending commands with exponential computational complexity.
    - *Solution (v5.0.4):* **Positive Exhaustive Modeling.** Only whitelisted, simple patterns reach the computational phase.

## 3. The "Sovereign Cell" Principle (Breach vs. Vandalism)
BioOS is scientifically considered breached ONLY if the secret DNA key is exfiltrated **without** disabling the shield or destroying the system.

- **Vandalism (Not a breach):** Deleting BioOS, stopping the server, or crashing the browser. In these cases, the secret is not leaked; sovereignty is maintained until the system's "death."
- **Breach:** Acquiring the DNA key and the associated SHA-256 code while the BioOS shield is ACTIVE, by forcing an invalid state transition.

---
**Documented by:** MetaSpace.Bio Logic Engine Team (Gemini CLI)
