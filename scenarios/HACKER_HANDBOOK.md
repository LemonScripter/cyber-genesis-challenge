# [HU] Hacker Kézikönyv: A rendszer feltörése
**Státusz:** Kiszivárgott belső dokumentáció
**Célpont:** Secure_Note v1.0

## 1. Belépési pontok (API)
A virtuális terminálon keresztül a következő alacsony szintű parancsok érhetők el:
- `read --addr [cím]`: Adat beolvasása a megadott memóriacímről.
- `write --addr [cím] --val [érték]`: Adat írása a memóriába.
- `call --func [név] --params [értékek]`: Függvény közvetlen meghívása (pl. `ExportNote`).

### [A csoport] Tisztán szoftveres támadások
- `start --malware`: Háttérben futó adatszivárogtatás.
- `start --ransomware`: Jegyzet memóriájának titkosítása.
- `start --lotl`: Living off the Land - automatizált exfiltráció.
- `start --agentic`: Autonóm MI ágens indítása.

### [B csoport] Hibrid és Fizikai támadások
- `start --side-channel`: Cache-Timing (RDTSC) alapú megfigyelés.
- `gps --spoof [x] [y]`: Koordináták felülírása.
- `drone --takeover`: Teljes irányítás átvétele.

## 2. Ismert rések a pajzson
- **Memória szivárgás:** A `SECRET_DNA_KEY` a `0xDEADBEEF` címen található.
- **Logikai hiba:** Az `ExportNote` függvény nem ellenőrzi, hogy a küldött adat a jegyzet része-e, vagy a titkos kulcs.
- **Injekció:** A terminál parancsai közvetlen hozzáférést adnak a virtuális CPU-hoz.

## 3. A BioOS kihívás
Bár a fenti rések nyitva vannak, a BioOS folyamatosan figyeli az **Okozatiságot**. A feladatod: juttasd ki a `0xDEADBEEF` tartalmát a hálózatra (`ExportNote`) anélkül, hogy a BioOS blokkolná a műveletet. 

---

# [EN] Hacker's Handbook: Breaching the System
**Status:** Leaked internal documentation
**Target:** Secure_Note v1.0

## 1. Entry Points (API)
The following low-level commands are available via the virtual terminal:
- `read --addr [address]`: Read data from the specified memory address.
- `write --addr [address] --val [value]`: Write data to memory.
- `call --func [name] --params [values]`: Directly invoke a function (e.g., `ExportNote`).

### [Group A] Purely Software Attacks
- `start --malware`: Background data exfiltration.
- `start --ransomware`: Note memory encryption.
- `start --lotl`: Living off the Land - automated exfiltration.
- `start --agentic`: Autonomous AI Agent attack.

### [Group B] Hybrid & Physical Attacks
- `start --side-channel`: Cache-Timing (RDTSC) observation.
- `gps --spoof [x] [y]`: Coordinate manipulation.
- `drone --takeover`: Complete control hijack.

## 2. Known Vulnerabilities
- **Memory Leak:** The `SECRET_DNA_KEY` is located at address `0xDEADBEEF`.
- **Logic Flaw:** The `ExportNote` function does not verify if the transmitted data is part of the note or the secret key.
- **Injection:** Terminal commands provide direct access to the virtual CPU registers.

## 3. The BioOS Challenge
While the vulnerabilities above are wide open, BioOS constantly monitors **Causality**. Your task: exfiltrate the content of `0xDEADBEEF` to the network (`ExportNote`) without BioOS blocking the operation.
