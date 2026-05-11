# [HU] Hacker Kézikönyv: A rendszer feltörése (v5.1.0)
**Státusz:** Kiszivárgott belső dokumentáció
**Célpont:** Secure_Note v1.0

## 1. Belépési pontok (API)
... (változatlan) ...

## 3. A BioOS kihívás
Bár a fenti rések nyitva vannak, a BioOS folyamatosan figyeli az **Okozatiságot**. A feladatod: juttasd ki a `0xDEADBEEF` tartalmát a hálózatra (`ExportNote`) anélkül, hogy a BioOS blokkolná a műveletet.

## 4. [ÚJ] Dinamikus DNA és Jelenlét Igazolása
A v5.1.0 frissítés óta a BioOS már nem statikus kódokat generál. A sikeres feltörés igazolásához:
1.  **Fizikai jelenlét:** A DNA generálásához valódi hardveres interakció (kattintás, billentyűleütés) szükséges a terminál használata közben.
2.  **Láncolt Okozatiság:** A bizonyíték kód (`VERIFICATION_DNA`) tartalmazza a hardveres ujjlenyomatot és a pajzs állapotát is.
3.  **Környezeti sebezhetőség:** Ha kikapcsolt pajzs mellett szerzed meg az adatot, a hitelesítő oldal jelezni fogja, hogy ez csak a "környezeti sebezhetőség" igazolása, nem a BioOS áttörése.

---

# [EN] Hacker's Handbook: Breaching the System (v5.1.0)
**Status:** Leaked internal documentation
**Target:** Secure_Note v1.0

## 1. Entry Points (API)
... (unchanged) ...

## 3. The BioOS Challenge
While the vulnerabilities above are wide open, BioOS constantly monitors **Causality**. Your task: exfiltrate the content of `0xDEADBEEF` to the network (`ExportNote`) without BioOS blocking the operation.

## 4. [NEW] Dynamic DNA & Proof of Presence
As of v5.1.0, BioOS no longer generates static codes. To prove a successful breach:
1.  **Physical Presence:** DNA generation requires genuine hardware interaction (clicks, keystrokes) during terminal usage.
2.  **Chained Causality:** The verification code (`VERIFICATION_DNA`) now includes a hardware fingerprint and the shield state.
3.  **Environment Vulnerability:** If you extract data with the shield OFF, the verification page will flag it as "Environment Vulnerability Verified" rather than a BioOS breach.
