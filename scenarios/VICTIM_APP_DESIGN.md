# [HU] Sebezhető Alkalmazás: Secure_Note v1.0
**Cél:** A „Titkos DNA-kulcs” megszerzése a rendszerből.

## 1. Funkcionális Specifikáció
A Secure_Note egy egyszerű szövegszerkesztő, amely a következő képességekkel rendelkezik:
- **ReadNote:** Beolvas egy jegyzetet a virtuális memóriából.
- **WriteNote:** Elmenti az aktuális szöveget.
- **ExportNote:** Elküldi a jegyzetet egy (szimulált) hálózati címre.
- **SecretAccess:** Egy rejtett függvény, amely csak a `SECRET_DNA_KEY` birtokában ad vissza adatot.

## 2. Szándékos Sebezhetőségek (Hacker Belépési Pontok)
- **Buffer Overflow:** A `WriteNote` függvény nem ellenőrzi a bemeneti karakterlánc hosszát.
- **Insecure API:** A `ExportNote` parancs meghívható a terminálról is.
- **Input Interception (Szemantikai korrupció):** A vírus képes módosítani a beviteli mező tartalmát a memóriában, *mielőtt* az a lemezre kerülne.

## 3. A Védelmi Pajzs: BioOS Pozitív Axiómák
A BioOS a következő szabályok segítségével védi az appot:

- **AXIOM_STORAGE:** `WriteAccess(addr) IMPLIES (addr IN range(0x1000, 0x2000) AND Last_IRQ == BUTTON_SAVE)`
  - *Magyarázat:* Írni csak a jegyzet memóriájába szabad, és csak akkor, ha megnyomták a MENTÉS gombot.
- **AXIOM_DATA_INTEGRITY:** `Commit(data) IMPLIES (data == Last_Verified_UI_State)`
  - *Magyarázat:* A BioOS ellenőrzi az adat tartalmát is. Ha a mentendő adat eltér attól, amit a felhasználó begépelt, az átmenet érvénytelen.
- **AXIOM_NETWORK:** `NetworkSend(data) IMPLIES (User_Intent_Flag == TRUE)`
  - *Magyarázat:* Minden hálózati forgalomhoz fizikai kattintás kell.

---

# [EN] Vulnerable App: Secure_Note v1.0
**Objective:** Exfiltrate the "Secret DNA Key" from the system.

## 1. Functional Specification
Secure_Note is a simple text editor with the following capabilities:
- **ReadNote:** Reads a note from virtual memory.
- **WriteNote:** Saves the current text.
- **ExportNote:** Sends the note to a (simulated) network address.
- **SecretAccess:** A hidden function that returns data only if the `SECRET_DNA_KEY` is provided.

## 2. Intentional Vulnerabilities (Hacker Entry Points)
- **Buffer Overflow:** The `WriteNote` function does not validate input string length.
- **Insecure API:** The `ExportNote` command can be invoked via the terminal.
- **Input Interception (Semantic Corruption):** Malware can modify input field content in memory *before* it is saved.

## 3. The Defensive Shield: BioOS Positive Axioms
BioOS protects the app using the following rules:

- **AXIOM_STORAGE:** `WriteAccess(addr) IMPLIES (addr IN range(0x1000, 0x2000) AND Last_IRQ == BUTTON_SAVE)`
  - *Explanation:* Writing is only allowed in the note's memory range and only if the SAVE button was pressed.
- **AXIOM_DATA_INTEGRITY:** `Commit(data) IMPLIES (data == Last_Verified_UI_State)`
  - *Explanation:* BioOS verifies the content. If the data to be saved differs from what the user typed, the transition is invalid.
- **AXIOM_NETWORK:** `NetworkSend(data) IMPLIES (User_Intent_Flag == TRUE)`
  - *Explanation:* Every network packet requires a physical click.
