# BioOS: Cyber Genesis Challenge - Kiadási Jelentés & Státusz (v5.0.1)
**Dátum:** 2026.05.10
**Állapot:** STABLE / PRODUCTION READY

## 1. Verzió Összefoglaló (v5.0.1)
Ez a kiadás kritikus javításokat tartalmaz az adatok pontossága, a felhasználói élmény és a rendszer biztonsági integritása terén.

### Elvégzett Javítások és Fejlesztések:
- **Stats Aggregáció Fix:** A `sync_stats.js` (Netlify Function) most már backend oldalon végzi a `COUNT(*)` műveleteket. Az `Összes kísérlet` számláló többé nem ragad be 50-nél, pontosan mutatja a teljes adatbázist.
- **Tartós Nyelvválasztás:** A `localStorage` integrációval a nyelvválasztás (HU/EN) perzisztens maradt az aloldalak (`stats.html`) és az oldalfrissítések között is.
- **Mobil Optimalizálás:** 
    - A táblázatok mobilon görgethetővé váltak (`table-container`).
    - A logok és terminál kimenetek tördelése (`word-break`) megakadályozza a UI szétcsúszását.
    - A telemetria szöveg átfedési hibája (overlap) javítva extra padding és margók hozzáadásával.
- **Biztonsági Szigorítás (100% Causal Closure):**
    - **Positive Axiom Exclusion:** Az SQL lekérdezések csak az előre definiált "fehérlistás" parancsokat engedik át.
    - **Target Validation:** A memória-írás (`WRITE`) mostantól ellenőrzi, hogy a kauzális token konkrétan a `save-btn`-től származik-e.
    - **isTrusted Védelem:** Megerősítettük, hogy szoftveresen generált eseményekkel nem lehet érvényes tokent szerezni.

## 2. Projekt Struktúra és Kontextus
A projekt a `CYBER_GENESIS_CHALLENGE` mappában található. Kulcsfájlok:
- `main.js`: Központi vezérlő logika és eseménykezelés.
- `bio_kernel_emu/Axiom_Validator.js`: A BioOS védelmi szabályrendszere (Z3 szimuláció).
- `bio_kernel_emu/Causality_Monitor.js`: A hardveres események (IRQ) hitelesítője.
- `stats_manager.js`: Felhő alapú statisztika és DNA verifikáció kezelője.

## 3. Jövőbeli Útiterv (Roadmap)

### PHASE 1: SUDO Meta-Attack (Következő feladat)
- **Cél:** Implementálni a `sudo --disable-bioos` parancsot a terminálba.
- **Logika:** A parancs szoftveres hívásként indul, így a `META_DISABLE` axióma (melyet még létre kell hozni) elutasítja, és a BioOS önvédelmi mechanizmusa (Apoptózis) aktiválódik.
- **Terv:** `plans/sudo_attack_plan.md` fájlban rögzítve.

### PHASE 2: Isolated JS Console (Web Worker)
- **Cél:** Egy teljesen izolált, Web Worker alapú végrehajtó környezet a hacker terminál számára.
- **Logika:** Még nagyobb biztonsági szint a sandbox számára, megakadályozva, hogy a hacker kód hozzáférjen a valódi DOM-hoz.
- **Terv:** `plans/web_worker_console_plan.md` fájlban rögzítve.

## 4. Kontextus Visszaállítása
Bármilyen "kontextus" vagy "státusz" kérésre ez a dokumentum tekintendő az abszolút forrásnak. Az aktuális kód pusholva van a `master` ágra, a deploy a Netlify-n éles.

---
**Auditálva:** MetaSpace.Bio Logic Engine Team
