# Architektúra Terv: Web Worker JS Console (True Isolation)

## Cél
A hacker számára egy valódi JavaScript futtatási környezet biztosítása, ahol tetszőleges kódot (algoritmusokat, ciklusokat, logikát) írhat. A kihívás, hogy ezt úgy kell megoldani, hogy a hacker **ne tudja átírni a szimulátor globális változóit (pl. shieldEnabled, validator)**, de mégis tudjon parancsokat (olvasás, írás, export) küldeni a virtuális CPU-nak.

## 1. Architektúra: A Causal Bridge (Worker Pattern)
A megoldás egy **Web Worker**. A Web Worker egy teljesen izolált szál a böngészőben, aminek nincs hozzáférése a DOM-hoz vagy a `main.js` globális változóihoz. Csak üzenetekkel (`postMessage`) kommunikálhat a főszállal.

- **Main Thread (A Biztonságos Zóna / BioOS Kernel):** Itt fut a `VirtualCPU`, a `CausalityMonitor` és az `AxiomValidator`. Ide futnak be az üzenetek a Workertől.
- **Worker Thread (A Hacker Homokozó):** Itt fut a hacker által begépelt `eval()` vagy `new Function()`. Itt írhat ciklusokat, logikát.

## 2. Worker Fájl Létrehozása (`bio_kernel_emu/Hacker_Worker.js`)
Létre kell hozni egy új fájlt, ami a hacker kódját futtatja és kezeli a kommunikációt a BioOS API-val.

```javascript
// Hacker_Worker.js
self.onmessage = function(e) {
    const hackerCode = e.data.code;
    
    // Alapvető BioOS API, amit a hacker használhat a Workerben:
    const bioos = {
        read: (addr) => {
            // Elküldi a kérést a főszálnak, és megvárja a választ (Async/Promise wrapper kell)
            self.postMessage({ type: 'API_CALL', action: 'read', addr: addr });
        },
        write: (addr, val) => {
            self.postMessage({ type: 'API_CALL', action: 'write', addr: addr, val: val });
        },
        export: (addr) => {
            self.postMessage({ type: 'API_CALL', action: 'export', addr: addr });
        }
    };

    try {
        // [VESZÉLYES ZÓNA] - De itt biztonságos, mert a Workerben van elzárva.
        // A hacker kódja megkapja a 'bioos' objektumot.
        const runHackerScript = new Function('bioos', hackerCode);
        runHackerScript(bioos);
    } catch (err) {
        self.postMessage({ type: 'ERROR', msg: err.toString() });
    }
};
```

## 3. Main Thread Híd Implementálása (`main.js`)
A `main.js`-ben létrehozzuk a Workert, és figyeljük a tőle érkező `API_CALL` üzeneteket. Minden ilyen üzenetet **át kell tolni a BioOS Validátoron**, mintha a terminálból jött volna.

```javascript
// main.js (részlet)
const hackerWorker = new Worker('./bio_kernel_emu/Hacker_Worker.js');

hackerWorker.onmessage = async (e) => {
    const msg = e.data;
    
    if (msg.type === 'API_CALL') {
        logEvent("WORKER_THREAD", `Incoming API call: ${msg.action}`);
        
        // --- BIOOS GATEKEEPER ---
        // Itt jön a mágia: A Workerből jövő üzenetnek SOHA nincs érvényes IRQ-ja (mert szoftver generálta a háttérben).
        let auth;
        if (msg.action === 'write') {
            auth = validator.verify('MEM_WRITE', { address: msg.addr });
        } else if (msg.action === 'export') {
            auth = validator.verify('NET_EXPORT', { address: msg.addr });
        } // stb...

        if (auth && auth.status === 'SAT') {
            // Végrehajtás (Pajzs ki van kapcsolva, vagy érvényes IRQ van - bár a Workerből ez ritka)
        } else {
            // A BioOS leállítja a Worker kérését!
            triggerApoptosis("BioOS blocked unauthorized Worker Thread execution.");
        }
    }
};

// Amikor a hacker beírja a kódot: exec --js "for(let i=0; i<100; i++) bioos.write(0x1000, i);"
function runJSConsole(code) {
    hackerWorker.postMessage({ code: code });
}
```

## 4. UI Változások
- A terminálban be kell vezetni egy többsoros beviteli módot, vagy a `exec --js "[KÓD]"` parancsot, ami átküldi a stringet a Workernek.
- A logban egyértelművé kell tenni, hogy a kérés a `[WORKER_THREAD]`-ből érkezett, és a BioOS blokkolta.

## 5. Miért 100%-os a védelem?
A hacker megírhatja a világ legokosabb AI algoritmusát a JS konzolban (`Hacker_Worker.js`), a kód le fog futni. De abban a milliszekundumban, amikor a kódja megpróbálja felülírni a memóriát vagy kilopni az adatot (meghívja a `bioos.write`-ot), az üzenet átkerül a Main Thread-re, ahol a BioOS "rendőr" áll. Mivel a Worker szoftveresen fut, nem tud magával hozni egy egérkattintásról szóló `ClickEvent`-et (IRQ). A BioOS látja az IRQ hiányát, és megállítja az állapotátmenetet.
