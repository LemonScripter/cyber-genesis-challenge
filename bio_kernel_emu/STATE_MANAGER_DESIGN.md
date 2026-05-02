# [HU] Virtuális Állapot-menedzser (Virtual State Manager)
**Szerepkör:** Az emulátor „memóriája” és állapot-felügyelője.

## 1. Az Állapotvektor (State Vector) felépítése
Minden pillanatban a rendszer egy pontos matematikai vektorként írható le:
- **Registers (Regiszterek):** 
    - `IP` (Instruction Pointer): A következő végrehajtandó parancs címe.
    - `SP` (Stack Pointer): A verem aktuális pozíciója.
- **Memory (Memória):**
    - `Heap`: Dinamikus adatok (pl. a jegyzet szövege).
    - `Text`: A program megváltoztathatatlan kódja.
- **Causal Context (Kauzális Kontextus):**
    - `Last_IRQ_Time`: Az utolsó validált hardveres megszakítás ideje.
    - `User_Intent_Level`: A szándék mértéke (pl. Single_Action, Mass_Action).

## 2. Tranzakciókezelés és Apoptózis
Az állapot-menedzser soha nem írja felül közvetlenül a memóriát. Minden művelet egy **„Állapot-jelölt” (State Candidate)**:
1.  **Proposal:** Beérkezik egy módosítási kérelem (pl. `Write(0x123, "data")`).
2.  **Snapshot:** A menedzser menti az aktuális „egészséges” állapotot.
3.  **Verification:** Átadja a szándékot a Z3-nak.
4.  **Commit/Rollback:**
    - Ha `SAT`: Az állapot véglegessé válik.
    - Ha `UNSAT`: **Apoptózis**. A rendszer eldobja a jelöltet, és visszaállítja a Snapshot-ot.

---

# [EN] Virtual State Manager
**Role:** The "Memory" and state supervisor of the emulator.

## 1. Structure of the State Vector
At any given moment, the system is described as a precise mathematical vector:
- **Registers:**
    - `IP` (Instruction Pointer): Address of the next command to be executed.
    - `SP` (Stack Pointer): Current position of the stack.
- **Memory:**
    - `Heap`: Dynamic data (e.g., the text of the note).
    - `Text`: Immutable code segment of the program.
- **Causal Context:**
    - `Last_IRQ_Time`: Timestamp of the last validated hardware interrupt.
    - `User_Intent_Level`: Magnitude of intent (e.g., Single_Action, Mass_Action).

## 2. Transaction Management and Apoptosis
The State Manager never overwrites memory directly. Every operation is treated as a **"State Candidate"**:
1.  **Proposal:** A modification request is received (e.g., `Write(0x123, "data")`).
2.  **Snapshot:** The manager saves the current "clean" state.
3.  **Verification:** The intent is passed to the Z3 Gatekeeper.
4.  **Commit/Rollback:**
    - If `SAT`: The state is finalized.
    - If `UNSAT`: **Apoptosis**. The system discards the candidate and restores the Snapshot.
