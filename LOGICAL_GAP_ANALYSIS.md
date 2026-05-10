# BioOS: Logikai Rés-elemzés és Pozitív Axióma Modell (Deep Audit)
**Verzió:** v5.0.3 -> v5.0.4 Terv
**Fókusz:** Miért maradtak rések a logikában?

---

## 1. A Probléma: Reaktív vs. Proaktív Védelem
Az eddigi verziókban (v5.0.0 - v5.0.2) a védelem részben **reaktív** volt:
- "Ne engedd az idézőjelet az SQL-ben." (Feketelista)
- "Csak 250ms-ig fogadd el a tokent." (Környezeti bizalom)
Ez a megközelítés hibás, mert feltételezi, hogy ismerjük az összes rossz irányt. A BioOS lényege a **Pozitív Okozatiság**: csak az létezik, amit a hardver explicit megenged.

## 2. Támadási Vektorok és a Hiányzó Logikai Szűrők

### A) XSS (Cross-Site Scripting) Vektor
- **Mi hiányzott?** A `logAttempt` függvény bármilyen stringet elfogadott `cmd` paraméterként.
- **Logikai Hiba:** Nem definiáltuk, hogy a "Naplózás" művelet szigorúan csak a terminál parancsainak strukturált reprezentációja lehet.
- **Megoldás v5.0.4:** A logikai szűrőnek verifikálnia kell a naplózandó adat struktúráját is (pl. Regex alapú parancs-hitelesítés az axiómában).

### B) Időmanipuláció (Clock Freeze)
- **Mi hiányzott?** A bizalom a gazdarendszer (`Date.now()`) órájában.
- **Logikai Hiba:** Az időt nem tekintettük a hardveres okozatiság részének.
- **Megoldás v5.0.4:** Bevezetjük a **"Logikai Tikkelést"**. Minden művelet növel egy belső számlálót. Az időablak nemcsak milliszekundumban, hanem műveleti lépésben is korlátozott lesz.

### C) SQL Injekció (Semantic Gap)
- **Mi hiányzott?** A parser és a validator különélése.
- **Logikai Hiba:** A validator egy stringet kapott, de nem tudta, hogy a backend SQL motorja hogyan fogja azt értelmezni.
- **Megoldás v5.0.4:** **Tokenizált Axiómák**. Nem stringeket verifikálunk, hanem parancs-objektumokat (pl. `QUERY: { table: 'notes', action: 'SELECT' }`).

### D) Memória Korrupció (Data Integrity)
- **Mi hiányzott?** A tartalom ellenőrzése.
- **Logikai Hiba:** A `MEM_WRITE` csak a címet nézte, az adatot nem.
- **Megoldás v5.0.4:** **Data-Bound Causality**. Az axióma ellenőrzi, hogy a memóriába írt byte-ok száma és típusa pontosan egyezik-e a UI mező (`note-input`) aktuális tartalmával.

---

## 3. Az Új Paradigma: "Exhaustive Positive Modeling"

Ebben a modellben nem azt mondjuk meg, mi TILOS, hanem **pontosan leírjuk az összes megengedett fizikai-digitális állapotátmenetet**:

1. **TRANSITION_SAVE_NOTE:**
   - *Fizikai:* `mousedown` on `save-btn` + `isTrusted`.
   - *Digitális:* `Heap[0x1000]` content == `DOM['note-input'].value`.
   - *Korlát:* Max 1024 bytes, UTF-8.

2. **TRANSITION_TERMINAL_CMD:**
   - *Fizikai:* `keydown` on `hacker-input` + `isTrusted`.
   - *Digitális:* Output formatted as `CodeBlock`, Sanitized.

3. **TRANSITION_SHIELD_TOGGLE:**
   - *Fizikai:* `mousedown` on `shield-toggle` + `isTrusted`.
   - *Digitális:* `shieldEnabled` flip.

---

## 4. Konklúzió: Miért lesz ez feltörhetetlen?
Minden, ami nem illeszkedik ezen szigorú sablonok (Axiómák) egyikére sem, az **nem létezik a BioOS számára**. Ha a hacker kódja megpróbál egy `Date.now()`-t manipulálni, az nem része egyetlen engedélyezett átmenetnek sem, így nincs hatása a biztonsági állapotra.

**Ezt a dokumentumot tekintjük a v5.0.4 alapkövének (Sovereignty Manifesto).**
