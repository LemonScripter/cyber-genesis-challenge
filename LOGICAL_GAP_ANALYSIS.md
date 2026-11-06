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

### E) Oksági lánc újrafelhasználása (aktiválás-/jegy-lovaglás) — 2026-11-07
- **Mi hiányzott?** A `CausalityMonitor` egyetlen, megosztott, utólag is lekérdezhető `lastToken`-t tartott fenn. Minden belépési pont (a terminál `keypress`-kezelője, a Mentés gomb `click`-kezelője) ezt az ÁLLAPOTOT kérdezte le, nem a SAJÁT, közvetlen kiváltó eseményét.
- **Logikai hiba:** egy szintetikus (`dispatchEvent`-tel előállított) `keypress` a terminálba bejuthatott, és egy KORÁBBI, más célú, valódi fizikai eseményből (pl. egy `mousedown` a Mentés gombon, teljes kattintás nélkül) származó, még fel nem használt jegyet "lovagolt" — így egy nem szándékolt művelet (`NET_EXPORT`) `SAT`-ot kapott. Mérve, helyi tesztben: valódi mousedown a Mentésen + szintetikus `keypress` a terminálba → a rendszer kiadta a győzelmi/bizonyíték-kódot egy olyan műveletre, amit senki nem szándékozott.
- **Megoldás (telepítve, 2026-11-07):** **atomi kapu** — minden belépési pont a SAJÁT, közvetlen kiváltó eseményének `isTrusted` jelzőjét nézi, szinkron módon, a handler legelső sorában, mielőtt bármi mást megnézne. Nem a Monitor megosztott állapotát kérdezi le. Ez megszünteti a "lovaglás" lehetőségét: egy szintetikus esemény, függetlenül attól, van-e érvényes jegy valahol máshol a lapon, fel sem dolgozódik.
- **Mérve, regresszió nélkül:** legitim kattintás és legitim terminálgépelés változatlanul működik; a demonstrált lovagló-lánc blokkolva, már a feldolgozás előtt.
- **Általánosítható tanulság (a szélesebb DCC/okozatiság-koncepcióhoz):** ha egy "oksági lánc" több, látszólag független elemből áll (cél-kötés, jelenlét, időablak), de ezek egy KÖZÖS, újra lekérdezhető állapotból (nem egymástól független, közvetlen forrásból) származnak, a lánc ereje egyetlen elemre csökken — egy támadó, aki csak EGY pontot ismer/irányít a folyamatban, mindkettőt (vagy többet) kielégítheti. A lánc minden elemét a SAJÁT, azonnali, nem megosztható forrásából kell igazolni.
- **Hatókör, ami nyitva marad:** ez a javítás a lap-szintű (script-eredetű) hamisítást zárja. Az OS-szintű bemenet-szimulálás (`SendInput`, `xdotool`) elleni védelemhez `isTrusted` önmagában nem elég (az ilyen esemény is megbízhatónak látszik) — ehhez egy külön, hardveres csatorna (pl. WebAuthn-alapú fizikai jelenlét-igazolás) kellene, amit tervben és helyi, virtuális-hitelesítős teszttel igazoltunk, de ide (élesben) még nem építettünk be.

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

## 4. Konklúzió: A tervezési cél
Minden, ami nem illeszkedik ezen szigorú sablonok (Axiómák) egyikére sem, az **nem létezik a BioOS számára**. Ha a hacker kódja megpróbál egy `Date.now()`-t manipulálni, az nem része egyetlen engedélyezett átmenetnek sem, így a terv szerint nincs hatása a biztonsági állapotra. Ez tervezési cél, nem bizonyított tulajdonság.

---

# [EN] BioOS: Logical Gap Analysis and Positive Axiom Model (Deep Audit)
**Version:** v5.0.3 -> v5.0.4 Plan
**Focus:** Why did logical gaps remain?

---

## 1. The Problem: Reactive vs. Proactive Defense
In previous versions (v5.0.0 - v5.0.2), protection was partly **reactive**:
- "Do not allow quotes in SQL." (Blacklisting)
- "Accept the token only for 250ms." (Environmental trust)
This approach is flawed because it assumes we know all possible attack vectors. The essence of BioOS is **Positive Causality**: only what the hardware explicitly permits exists.

## 2. Attack Vectors and Missing Logical Filters

### A) XSS (Cross-Site Scripting) Vector
- **Missing Link:** The `logAttempt` function accepted any string as a `cmd` parameter.
- **Logical Flaw:** We did not define that the "Logging" operation must strictly be a structured representation of terminal commands.
- **v5.0.4 Solution:** The logical filter must verify the structure of the data to be logged (e.g., Regex-based command authentication in the axiom).

### B) Time Manipulation (Clock Freeze)
- **Missing Link:** Trust in the host system's clock (`Date.now()`).
- **Logical Flaw:** Time was not considered part of hardware causality.
- **v5.0.4 Solution:** Introduction of **"Logical Ticking"**. Every operation increments an internal counter. The time window is restricted not just in milliseconds, but in operational steps.

### C) SQL Injection (Semantic Gap)
- **Missing Link:** Separation of parser and validator.
- **Logical Flaw:** The validator received a string but did not know how the backend SQL engine would interpret it.
- **v5.0.4 Solution:** **Tokenized Axioms**. We verify command objects instead of strings (e.g., `QUERY: { table: 'notes', action: 'SELECT' }`).

### D) Memory Corruption (Data Integrity)
- **Missing Link:** Content verification.
- **Logical Flaw:** `MEM_WRITE` only checked the address, not the data.
- **v5.0.4 Solution:** **Data-Bound Causality**. The axiom verifies that the bytes written to memory match exactly the current content of the UI field (`note-input`).

---

## 3. The New Paradigm: "Exhaustive Positive Modeling"

In this model, we do not state what is FORBIDDEN; instead, we **precisely describe all permitted physical-to-digital state transitions**:

1. **TRANSITION_SAVE_NOTE:**
   - *Physical:* `mousedown` on `save-btn` + `isTrusted`.
   - *Digital:* `Heap[0x1000]` content == `DOM['note-input'].value`.
   - *Limit:* Max 1024 bytes, UTF-8.

2. **TRANSITION_TERMINAL_CMD:**
   - *Physical:* `keydown` on `hacker-input` + `isTrusted`.
   - *Digital:* Output formatted as `CodeBlock`, Sanitized.

3. **TRANSITION_SHIELD_TOGGLE:**
   - *Physical:* `mousedown` on `shield-toggle` + `isTrusted`.
   - *Digital:* `shieldEnabled` flip.

---

## 4. Conclusion: The design goal
Anything that does not fit into one of these strict templates (Axioms) **does not exist for BioOS**. If hacker code attempts to manipulate `Date.now()`, it is not part of any permitted transition and thus is designed to have no effect on the security state. This is a design goal, not a proven property.
