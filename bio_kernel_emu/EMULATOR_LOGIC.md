# [HU] BioOS Emulátor: Logikai mag és architektúra

Az emulátor a BioOS „digitális ikre” a böngészőben. Feladata, hogy szimulálja a Ring 0 szintű hardver-szoftver kapcsolatot, és érvényesítse a **Digitális Okozatisági Zártságot**.

---

## 1. A három fő komponens

Az emulátor három, egymástól szigorúan elválasztott rétegből áll:

### A) Virtuális Állapot-gép (Virtual State Manager)
Ez felel a rendszer „emlékezetéért”. Nem egy teljes x86 emulációról van szó, hanem egy **Absztrakt Állapotvektorról (State Vector)**.
- **Változók:** IP (Instruction Pointer), Stack (Verem), Heap (Memória), és a `Causal_Log` (az események története).
- **Működése:** Minden egyes parancs (legyen az legális app-funkció vagy hacker exploit) egy állapotátmenetet kísérel meg. Az emulátor ezt az átmenetet „felfüggesztett” állapotban tartja a verifikációig.

### B) Kauzális IRQ Híd (Causal IRQ Bridge)
Ez a BioOS legfontosabb védelmi vonala. Ez az egyetlen komponens, amely képes **„Validált Szándékot”** (User Intent) generálni.
- **Működése:** Figyeli a böngésző natív eseményeit (pl. `mousedown` a MENTÉS gombon). 
- **Biztonság:** Csak a valódi UI-interakciók generálnak `HARDWARE_IRQ` szignált. Ha a hacker a terminálon keresztül hív meg egy függvényt, az **nem generál IRQ-t**, így az okozati lánc megszakad.

### C) Z3 Logikai Kapu (Z3 Gatekeeper)
Egy szűkített, JS-alapú SMT solver logika, amely a `.bio` fájlok axiómáit kényszeríti rá az állapotátmenetekre.
- **Bemenet:** Aktuális állapot + Kért állapotváltozás + IRQ szignálok.
- **Logika:** `Végrehajtás(Művelet) <-> (Axióma_Szerint_Legális(Művelet) AND Van_Mögötte_IRQ)`.
- **Kimenet:** `SAT` (Végrehajtható) vagy `UNSAT` (Okozatisági törés).

---

## 2. A „Challenge” végrehajtási folyamata

Amikor egy parancs érkezik a terminálról:

1.  **Intercept (Elkapás):** Az emulátor megállítja a parancsot a „küszöbön”.
2.  **State Capture:** Pillanatfelvétel készül a virtuális memóriáról.
3.  **Causality Trace:** A rendszer visszanéz a `Causal_Log`-ban: „Történt-e hardveres IRQ az elmúlt 100 ms-ban?”
4.  **Verification:** A Z3 mag összeveti a szándékot a `.bio` fájllal.
5.  **Döntés:**
    - `SAT`: A parancs lefut (pl. a jegyzet mentése).
    - `UNSAT`: **Apoptózis fázis**. A rendszer piros riasztást ad, és visszatölti a memóriát az utolsó tiszta állapotból.

---

## 3. Miért 100% a védelem ebben a modellben?

Azért, mert a hacker egy **logikai paradoxonnal** küzd. 
- Ahhoz, hogy a kódja lefusson, szüksége lenne egy hardveres megszakításra. 
- A hardveres megszakítás azonban fizikailag a felhasználó kezében van (egér/billentyűzet). 
- Mivel a hacker nem tudja fizikailag megnyomni a felhasználó gombját a távolból, a kódja örökre az „unverifiable” (igazolhatatlan) zónában marad.

---

# [EN] BioOS Emulator: Logic Core and Architecture

The emulator is the "digital twin" of BioOS in the browser. Its task is to simulate the Ring 0 level hardware-software relationship and enforce **Digital Causal Closure**.

---

## 1. The Three Main Components

The emulator consists of three strictly separated layers:

### A) Virtual State Manager
Responsible for the system's "memory". This is not a full x86 emulation, but an **Abstract State Vector**.
- **Variables:** IP (Instruction Pointer), Stack, Heap (Memory), and the `Causal_Log` (event history).
- **Operation:** Every command (whether a legal app function or a hacker exploit) attempts a state transition. The emulator holds this transition in a "suspended" state until verification.

### B) Causal IRQ Bridge
BioOS's most critical line of defense. This is the only component capable of generating **"Validated Intent"** (User Intent).
- **Operation:** Monitors native browser events (e.g., `mousedown` on the SAVE button). 
- **Security:** Only genuine UI interactions generate a `HARDWARE_IRQ` signal. If a hacker invokes a function via the terminal, it **does not generate an IRQ**, thus breaking the causal chain.

### C) Z3 Gatekeeper
A stripped-down, JS-based SMT solver logic that enforces `.bio` file axioms on state transitions.
- **Input:** Current state + Requested state change + IRQ signals.
- **Logic:** `Execution(Operation) <-> (Legal_by_Axiom(Operation) AND Supported_by_IRQ)`.
- **Output:** `SAT` (Satisfiable) or `UNSAT` (Causal Breach).

---

## 2. The "Challenge" Execution Process

When a command arrives from the terminal:

1.  **Intercept:** The emulator stops the command at the "threshold".
2.  **State Capture:** A snapshot of virtual memory is taken.
3.  **Causality Trace:** The system checks the `Causal_Log`: "Was there a hardware IRQ in the last 100 ms?"
4.  **Verification:** The Z3 core compares the intent with the `.bio` file.
5.  **Decision:**
    - `SAT`: The command executes (e.g., saving the note).
    - `UNSAT`: **Apoptosis phase**. The system issues a red alert and restores memory from the last clean state.

---

## 3. Why is Protection 100% in this Model?

Because the hacker faces a **logical paradox**. 
- To run their code, they would need a hardware interrupt. 
- However, the hardware interrupt is physically in the user's hand (mouse/keyboard). 
- Since the hacker cannot physically press the user's button remotely, their code remains in the "unverifiable" zone forever.
