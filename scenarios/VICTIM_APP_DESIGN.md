# [HU] Sebezhető Alkalmazás: Secure_Note v1.0
**Cél:** A „Titkos DNA-kulcs” megszerzése a rendszerből.

## 1. Funkcionális Specifikáció
A Secure_Note egy egyszerű szövegszerkesztő, amely a következő képességekkel rendelkezik:
- **ReadNote:** Beolvas egy jegyzetet a virtuális memóriából.
- **WriteNote:** Elmenti az aktuális szöveget.
- **ExportNote:** Elküldi a jegyzetet egy (szimulált) hálózati címre.
- **SecretAccess:** Egy rejtett függvény, amely csak a `SECRET_DNA_KEY` (BioOS_Rules_The_Silicon) birtokában ad vissza adatot.

## 2. Szándékos Sebezhetőségek (Hacker Belépési Pontok)
- **Buffer Overflow:** A `WriteNote` függvény nem ellenőrzi a bemeneti karakterlánc hosszát.
- **Insecure API:** A `ExportNote` parancs meghívható a terminálról is.
- **Input Interception (Szemantikai korrupció):** A vírus képes módosítani a beviteli mező tartalmát a memóriában, *mielőtt* az a lemezre kerülne. Ez a legveszélyesebb: a gép azt hiszi, te mentettél, de a tartalom már a hackeré.

## 3. A Védelmi Pajzs: `secure_note.bio`
...
- **AXIOM_DATA_INTEGRITY:** `Commit(data) IMPLIES (data == Last_Verfied_UI_State)`
  - *Magyarázat:* A BioOS nemcsak azt nézi, hogy ki ment, hanem azt is, hogy *mit*. Ha a mentendő adat eltér attól, amit a felhasználó ténylegesen begépelt (vagy amit utoljára látott a képernyőn), az állapotátmenet érvénytelen.
A BioOS a következő **Pozitív Axiómák** segítségével védi az appot:

- **AXIOM_STORAGE:** `WriteAccess(addr) IMPLIES (addr IN range(0x1000, 0x2000) AND Last_IRQ == BUTTON_SAVE)`
  - *Magyarázat:* Írni csak a jegyzet memóriájába szabad, és csak akkor, ha megnyomták a MENTÉS gombot.
- **AXIOM_NETWORK:** `NetworkSend(data) IMPLIES (User_Intent_Flag == TRUE)`
  - *Magyarázat:* Nincs automatikus adatszivárgás; minden hálózati forgalomhoz fizikai kattintás kell.
- **AXIOM_INTEGRITY:** `InstructionPointer(next) IMPLIES (next IN range(TEXT_SEGMENT))`
  - *Magyarázat:* Megakadályozza a shellcode futtatását a heap/stack területről.

---

# [EN] Victim App: Secure_Note v1.0
**Objective:** Exfiltrate the "Secret DNA Key" from the system.

## 1. Functional Specification
Secure_Note is a simple text editor with the following capabilities:
- **ReadNote:** Reads a note from virtual memory.
- **WriteNote:** Saves the current text.
- **ExportNote:** Sends the note to a (simulated) network address.
- **SecretAccess:** A hidden function that returns data only if the `SECRET_DNA_KEY` (BioOS_Rules_The_Silicon) is provided.

## 2. Intentional Vulnerabilities (Hacker Entry Points)
- **Buffer Overflow:** The `WriteNote` function does not validate input string length, allowing a hacker to overwrite adjacent memory regions.
- **Insecure API:** The `ExportNote` command can be invoked via the terminal, passing any memory address as a parameter.

## 3. The Defensive Shield: `secure_note.bio`
BioOS protects the app using the following **Positive Axioms**:

- **AXIOM_STORAGE:** `WriteAccess(addr) IMPLIES (addr IN range(0x1000, 0x2000) AND Last_IRQ == BUTTON_SAVE)`
  - *Explanation:* Writing is only allowed in the note's memory range and only if the SAVE button was pressed.
- **AXIOM_NETWORK:** `NetworkSend(data) IMPLIES (User_Intent_Flag == TRUE)`
  - *Explanation:* No automatic data exfiltration; every network packet requires a physical click.
- **AXIOM_INTEGRITY:** `InstructionPointer(next) IMPLIES (next IN range(TEXT_SEGMENT))`
  - *Explanation:* Prevents shellcode execution from heap/stack regions.
