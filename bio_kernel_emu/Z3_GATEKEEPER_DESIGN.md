# [HU] Z3 Logikai Kapu (Z3 Gatekeeper)
**Szerepkör:** A rendszer „lelkiismerete” és döntéshozója. Ez a modul végzi a formális verifikációt a kért állapotátmeneteken.

## 1. A döntési mátrix (Decision Matrix)
Minden egyes műveletet a következő három változó alapján ítél meg:
1.  **Szándék (Intent):** Van-e érvényes Kauzális Token az IRQ Bridge-től?
2.  **Hatókör (Scope):** A művelet megfelel-e a program pozitív axiómáinak (pl. csak a saját fájlját írja)?
3.  **Integritás (Integrity):** A művelet nem változtatja-e meg a program védett memóriaterületeit?

## 2. Kimenetek: SAT vs. UNSAT
A Z3 Solver két lehetséges választ adhat:
- **SAT (Satisfiable):** A művelet matematikailag levezethető a szándékból és az axiómákból.
    - *Eredmény:* A State Manager véglegesíti az állapotot (Commit).
- **UNSAT (Unsatisfiable):** A művelet logikai ellentmondást tartalmaz (pl. hálózati küldés IRQ nélkül).
    - *Eredmény:* Azonnali **Apoptózis**. A rendszer megállítja a végrehajtást és regenerálja a sejtet.

## 3. Hibatűrés és Biztonság
- **Timeout (Időtúllépés):** Ha a verifikáció túl sokáig tart (pl. bonyolult számítás), a rendszer alapértelmezésben **UNSAT** eredményt ad.
- **Fail-Safe:** Bármilyen bizonytalanság esetén a BioOS a biztonságot választja a működés helyett.

---

# [EN] Z3 Gatekeeper
**Role:** The "Conscience" and decision-maker of the system. This module performs formal verification on proposed state transitions.

## 1. Decision Matrix
Every operation is judged based on the following three variables:
1.  **Intent:** Is there a valid Causal Token from the IRQ Bridge?
2.  **Scope:** Does the operation comply with the program's positive axioms (e.g., writing only its own file)?
3.  **Integrity:** Does the operation refrain from modifying protected memory regions?

## 2. Outputs: SAT vs. UNSAT
The Z3 Solver can return two possible answers:
- **SAT (Satisfiable):** The operation is mathematically derivable from the intent and the axioms.
    - *Result:* The State Manager finalizes the state (Commit).
- **UNSAT (Unsatisfiable):** The operation contains a logical contradiction (e.g., network send without IRQ).
    - *Result:* Immediate **Apoptosis**. The system stops execution and regenerates the cell.

## 3. Fault Tolerance and Security
- **Timeout:** If verification takes too long (e.g., complex computation), the system defaults to **UNSAT**.
- **Fail-Safe:** In case of any uncertainty, BioOS prioritizes security over availability.
