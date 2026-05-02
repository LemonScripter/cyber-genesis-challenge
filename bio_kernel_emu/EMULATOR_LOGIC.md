# BioOS Emulator: Logikai mag és architektúra

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
    - *Példa hacker támadásra:* A hacker parancsa `WIPE_DISK`. A `.bio` szerint ehhez `ADMIN_IRQ` kellene. Mivel a hacker terminálból jött, az IRQ hiányzik.
5.  **Döntés:**
    - `SAT`: A parancs lefut (pl. a jegyzet mentése).
    - `UNSAT`: **Apoptózis fázis**. A rendszer piros riasztást ad, és visszatölti a memóriát az utolsó tiszta állapotból.

---

## 3. Miért 100% a védelem ebben a modellben?

Azért, mert a hacker egy **logikai paradoxonnal** küzd. 
- Ahhoz, hogy a kódja lefusson, szüksége lenne egy hardveres megszakításra. 
- A hardveres megszakítás azonban fizikailag a felhasználó kezében van (egér/billentyűzet). 
- Mivel a hacker nem tudja fizikailag megnyomni a felhasználó gombját a távolból, a kódja örökre az „unverifiable” (igazolhatatlan) zónában marad.

**Ez a technikai mélység megfelelő a folytatáshoz?** Ha igen, megkezdhetem a `bio_kernel_emu/` könyvtár belső moduljainak (a State Manager és az IRQ Bridge) logikai vázlatát.
