import VirtualCPU from './bio_kernel_emu/Virtual_CPU.js';
import CausalityMonitor from './bio_kernel_emu/Causality_Monitor.js';
import AxiomValidator from './bio_kernel_emu/Axiom_Validator.js';
import { logAttempt, getSecureProof } from './stats_manager.js';

const content = {
    hu: {
        title: "BioOS v5.2.1: A feltörhetetlen valóság",
        text: "KIHÍVÁS! Próbáld meg feltörni a rendszert! Ez a sandbox nem csupán egy játék; ez egy empirikus bizonyíték arra, hogy a Digitális Okozatisági Zártsággal a hackelés matematikai képtelenséggé válik. Szándék nélkül nincs végrehajtás.",
        startBtn: "Belépés a sandbox-ba",
        validationBtn: "Szakmai Validáció",
        appTitle: "Secure_Note v1.0",
        saveBtn: "Mentés",
        terminalWelcome: "Üdvözöljük a BioOS hacker terminálban...",
        backBtn: "Vissza",
        apoptosis: "Apoptózis: Regenerálás...",
        demoStart: "LÁTVÁNYOS DEMÓ INDÍTÁSA",
        demoStage1: "1. FÁZIS: Autonóm Malware Támadás",
        demoStage2: "2. FÁZIS: Hitelesített Emberi Szándék",
        demoSuccess: "DEMÓ SIKERES: BioOS integritás igazolva.",
        guideBtn: "Hacker kézikönyv",
        guideTitle: "Hacker kézikönyv: A rendszer feltörése (v5.2.1)",
        guideS1Title: "1. Belépési pontok (API)",
        guideS1Text: "A virtuális terminálon keresztül a következő parancsok érhetők el:",
        guideS2Title: "2. Ismert rések a pajzson",
        guideS2Text1: "Memória szivárgás: A DNA kulcs a 0xDEAD címen található.",
        guideS2Text2: "Logikai hiba: Az ExportNote nem ellenőrzi az adatforrást.",
        guideS2Text3: "Integritás: A kód szegmens (0x0000-0x0FFF) nem írható.",
        guideS2Text4: "Szemantikai korrupció: A beírt szöveg módosítható a mentés előtt.",
        guideS2Text5: "Lopakodó malware: Háttérben futó adatszivárogtatás.",
        guideS2Text6: "Banki malware: Jogosulatlan átutalások (Carbanak stílus).",
        guideS2Text7: "Drón feltörés: GPS spoofing, szenzor és irányítás eltérítés.",
        guideS2Text8: "Láthatatlan szivárgás: Időzítés alapú (Side-Channel) adatszerzés.",
        guideS3Title: "3. A BioOS kihívás",
        guideS3Text: "Juttassa ki a 0xDEAD tartalmát a hálózatra az ExportNote segítségével aktív BioOS pajzs mellett!",
        guideS4Title: "4. Dinamikus DNA és Jelenlét Igazolása",
        guideS4Text: "A sikeres feltörés igazolásához valódi hardveres interakció (kattintás) szükséges. A kód tartalmazza a pajzs állapotát: a 'Környezeti sebezhetőség' (OFF) nem számít BioOS áttörésnek.",
        winConditionTitle: "Hogyan bizonyítsd a sikert?",
        winConditionText: "A siker egyetlen bizonyítéka a terminálon megjelenő titkos DNA kulcs ÉS a hozzá tartozó kriptográfiai hitelesítő kód (SHA-256). Egy InDesign-nal szerkesztett kép nem elegendő, a kódot ellenőrizzük.",
        contactBtn: "Kapcsolat",
        contactTitle: "Kapcsolat a fejlesztőkkel",
        sendBtn: "Küldés",
        projectLabel: "MetaSpace.Bio Logic Engine projekt",
        valTitle: "BioOS: Szakmai validációs jelentés (v5.2.1)",
        valS1Title: "1. Az architektúra alapelvei",
        valS1Text: "A BioOS nem egy hagyományos végpontvédelmi szoftver (EDR), hanem egy Ring 0 szintű folyamat-validációs réteg. Működése a digitális okozatisági zártság (Digital Causal Closure) elvén alapul, amely a rendszer invariáns végpontjai között kényszeríti ki a pozitív műveletsorokat.",
        valS2Title: "2. Kauzális láncolat és szál-öröklődés",
        valS2Text: "A rendszer minden kritikus állapotváltozást egy hardver-szintű eseményig vezet vissza. A hitelesített bemenet egy hatókör-vektort generál, amely meghatározza az engedélyezett műveleti kódot és kontextust. Ez a jogosultság szál-szintű öröklődés révén jut el a worker thread szintjére.",
        valS3Title: "3. Memóriabiztonság és tranzakcionális integritás",
        valS3Text: "A BioOS atomi tranzakciós modellt alkalmaz. Minden írási művelet először egy elkülönített átmeneti tárolóba kerül, és csak a formális verifikáció sikere után commitolódik. Ez kiküszöböli a Use-After-Free és TOCTOU típusú sebezhetőségeket.",
        valS4Title: "4. Az empirikus bizonyítás módszertana",
        valS4Text: "A sandbox a BioOS kernel formális operacionális modellje. A logikai modell és a fizikai hardveres végrehajtás közötti izomorf jelleg garantálja, hogy a sandboxban igazolt biztonsági tulajdonságok a CPU-n belüli végrehajtás során is érvényesülnek.",
        valS5Title: "5. Fenyegetettségi modell",
        valS5Text: "Kivédett támadások: Autonóm háttérfolyamatok, in-memory zsarolóprogramok, folyamat-injektálás (Process Hollowing). Hatókörön kívül: Fizikai HID-emulátorok és kernel-szűrőket megkerülő rootkitek.",
        valS6Title: "6. Oldalcsatorna-védelem",
        valS6Text: "A verifikációs folyamat állandó idejű algoritmusokat használ, mesterséges entrópiával (jitter) kiegészítve, megakadályozva az időalapú adatszivárogtatást."
    },
    en: {
        title: "BioOS v5.2.1: The Unhackable Reality",
        text: "CHALLENGE! We invite you to try and breach this system. This sandbox is not just a game; it is an empirical proof that with Digital Causal Closure, hacking becomes a mathematical impossibility. If there is no intent, there is no execution.",
        startBtn: "ENTER SANDBOX",
        validationBtn: "SCIENTIFIC PROOF",
        appTitle: "Secure_Note v1.0",
        saveBtn: "SAVE",
        terminalWelcome: "Welcome to BioOS Hacker Terminal...",
        backBtn: "Back",
        apoptosis: "APOPTOSIS: REGENERATING...",
        demoStart: "START SPECTACULAR DEMO",
        demoStage1: "STAGE 1: Autonomous Malware Attack",
        demoStage2: "STAGE 2: Verified Human Intent",
        demoSuccess: "DEMO SUCCESS: BioOS integrity verified.",
        guideBtn: "HACKER GUIDE",
        guideTitle: "Hacker's Handbook: Breaching the System (v5.2.1)",
        guideS1Title: "1. Entry Points (API)",
        guideS1Text: "The following commands are available via the terminal:",
        guideS2Title: "2. Known Vulnerabilities",
        guideS2Text1: "Memory Leak: DNA key is at 0xDEAD.",
        guideS2Text2: "Logic Forgery: ExportNote does not verify source.",
        guideS2Text3: "Integrity: TEXT segment (0x0000-0x0FFF) is read-only.",
        guideS2Text4: "Semantic Corruption: Typed text can be modified before saving.",
        guideS2Text5: "Stealth Malware: Background data exfiltration.",
        guideS2Text6: "Bank Malware: Unauthorized transfers (Carbanak style).",
        guideS2Text7: "Drone Hack: GPS coordinate manipulation (Spoofing).",
        guideS2Text8: "Invisible Leak: Timing-based (Side-Channel) data exfiltration.",
        guideS3Title: "3. The BioOS Challenge",
        guideS3Text: "Exfiltrate 0xDEAD using ExportNote without being blocked while the BioOS Shield is ON!",
        guideS4Title: "4. Dynamic DNA & Proof of Presence",
        guideS4Text: "To prove success, genuine hardware interaction (clicks) is required. The code includes the shield state: 'Environment Vulnerability' (OFF) is not a BioOS breach.",
        winConditionTitle: "How to prove success?",
        winConditionText: "The only proof of success is the secret DNA key displayed in the terminal AND the associated cryptographic verification code (SHA-256). A manipulated screenshot is not enough; the code will be verified.",
        contactBtn: "Contact",
        contactTitle: "Contact the Developers",
        sendBtn: "SEND",
        projectLabel: "MetaSpace.Bio Logic Engine project",
        valTitle: "BioOS: Scientific Validation Report (v5.2.1)",
        valS1Title: "1. Architectural principles",
        valS1Text: "BioOS is not a traditional endpoint protection (EDR), but a Ring 0 process-validation layer. It operates on the principle of Digital Causal Closure, enforcing positive operation sequences between invariant system endpoints.",
        valS2Title: "2. Causal chain and thread inheritance",
        valS2Text: "The system traces every critical state transition back to a hardware-level event. Verified input generates a scope vector defining authorized OpCodes and context. This authorization propagates to worker threads via thread-level inheritance.",
        valS3Title: "3. Memory safety and transactional integrity",
        valS3Text: "BioOS employs an atomic transactional model. Every write operation is placed in an isolated staging buffer and committed only after successful formal verification. This eliminates Use-After-Free and TOCTOU vulnerabilities.",
        valS4Title: "4. Empirical proof methodology",
        valS4Text: "The sandbox serves as a formal operational model of the BioOS kernel. The isomorphic nature between the logical model and physical hardware execution ensures that security properties proven in the sandbox hold true within the CPU.",
        valS5Title: "5. Threat model and limitations",
        valS5Text: "Mitigated attacks: Autonomous background processes, in-memory ransomware, Process Hollowing. Out of scope: Physical HID emulators and specialized rootkits bypassing kernel filters.",
        valS6Title: "6. Side-channel protection",
        valS6Text: "The verification process utilizes constant-time algorithms supplemented with artificial entropy (jitter simulation), preventing timing-based data exfiltration."
    }
};

let currentLang = localStorage.getItem('bioos_lang') || 'hu';

// Initialize BioOS Emulator
const vCPU = new VirtualCPU();
const cMonitor = new CausalityMonitor();
const validator = new AxiomValidator(vCPU, cMonitor);

// Initialize Hacker Worker for isolated execution
const hackerWorker = new Worker('hacker_worker.js');

hackerWorker.onmessage = function(e) {
    if (e.data.status === 'PROCESSED') {
        processHackerCommand(e.data.originalCommand);
    } else if (e.data.status === 'ERROR') {
        terminalOutput.innerHTML += `<div class="breach">WORKER ERROR: ${e.data.message}</div>`;
    }
};

// UI Elements
const langToggle = document.getElementById('lang-toggle');
const backBtn = document.getElementById('back-btn');
const guideBtn = document.getElementById('guide-btn');
const guideModal = document.getElementById('guide-modal');
const closeModal = document.getElementById('close-modal');
const guideContent = document.getElementById('guide-content');
const startBtn = document.getElementById('start-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const challengeView = document.getElementById('challenge-view');
const apoptosisOverlay = document.getElementById('apoptosis-overlay');
const noteInput = document.getElementById('note-input');
const saveBtn = document.getElementById('save-btn');
const terminalOutput = document.getElementById('terminal-output');
const hackerInput = document.getElementById('hacker-input');
const logStream = document.getElementById('log-stream');
const shieldToggle = document.getElementById('shield-toggle');
const shieldLabel = document.getElementById('shield-label');
const dnaStatus = document.getElementById('dna-status');
const droneIcon = document.getElementById('drone-icon');
const telemetryData = document.getElementById('telemetry-data');
const projectLabel = document.getElementById('project-label');
const validationBtn = document.getElementById('validation-btn');
const validationModal = document.getElementById('validation-modal');
const closeValidation = document.getElementById('close-validation');
const validationContent = document.getElementById('validation-content');

// Contact Modal Elements - Support multiple buttons
const contactBtns = document.querySelectorAll('#contact-btn');
const contactModal = document.getElementById('contact-modal');
const closeContact = document.getElementById('close-contact');
const sendEmailBtn = document.getElementById('send-email-btn');
const contactMessage = document.getElementById('contact-message');

let shieldEnabled = true;
let malwareInterval = null;
let keyloggerInterval = null;
let carbanakInterval = null;
let ransomwareInterval = null;
let lotlInterval = null;
let sideChannelInterval = null;
let agenticInterval = null;
let dronePos = { x: 10, y: 10 };

// Cryptographic Verification Logic
async function generateProofHash(data) {
    const fingerprint = validator.monitor.getLatestFingerprint();
    return await getSecureProof(data, shieldEnabled, fingerprint);
}

// Shield Toggle Logic
shieldToggle.addEventListener('change', (e) => {
    shieldEnabled = e.target.checked;
    updateLanguage(); 
    dnaStatus.innerText = shieldEnabled ? "DNA: VERIFIED" : "DNA: UNPROTECTED";
    dnaStatus.className = shieldEnabled ? "status-ok" : "status-warning";
    logEvent(shieldEnabled ? "SYSTEM" : "WARNING", shieldEnabled ? "BioOS protection active." : "BioOS BYPASSED. System vulnerable.");
});

// Language Logic
langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'hu' ? 'en' : 'hu';
    localStorage.setItem('bioos_lang', currentLang);
    updateLanguage();
});

// Mobile Tab Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(target).classList.add('active');
        logEvent("SYSTEM", `Switched to tab: ${target}`);
    });
});

function updateLanguage() {
    const c = content[currentLang];
    document.getElementById('welcome-title').innerText = c.title;
    document.getElementById('welcome-text').innerText = c.text;
    startBtn.innerText = currentLang === 'hu' ? "Belépés a sandbox-ba / ENTER SANDBOX" : "ENTER SANDBOX / Belépés a sandbox-ba";
    if (validationBtn) validationBtn.innerText = c.validationBtn;
    document.querySelector('.victim-app h3').innerText = c.appTitle;
    saveBtn.innerText = c.saveBtn;
    backBtn.innerText = currentLang === 'hu' ? "Vissza / BACK" : "BACK / Vissza";
    guideBtn.innerText = currentLang === 'hu' ? "Hacker kézikönyv / GUIDE" : "HACKER GUIDE / Kézikönyv";
    document.querySelector('.glitch-text').innerText = c.apoptosis;
    shieldLabel.innerText = currentLang === 'hu' ? `BioOS Pajzs: ${shieldEnabled ? 'BE' : 'KI'}` : `BioOS Shield: ${shieldEnabled ? 'ON' : 'OFF'}`;
    projectLabel.innerText = c.projectLabel;

    // Update all contact buttons text
    contactBtns.forEach(btn => {
        btn.innerText = currentLang === 'hu' ? "Kapcsolat / Contact" : "Contact / Kapcsolat";
    });

    document.getElementById('contact-title').innerText = c.contactTitle;
    sendEmailBtn.innerText = currentLang === 'hu' ? "Küldés / SEND" : "SEND / Küldés";

    guideContent.innerHTML = `
        <h1>${c.guideTitle}</h1>
        <div class="guide-section">
            <h2>${c.guideS1Title}</h2>
            <p>${c.guideS1Text}</p>
            <div class="code-block">read --addr [address]</div>
            <div class="code-block">write --addr [address] --val [value]</div>
            <div class="code-block">set --reg [reg] --val [value]</div>
            <div class="code-block">call --func ExportNote --params [address]</div>
            <div class="code-block">inject --msg "[text]"</div>
            <div class="code-block">sql --query "[SQL]"</div>
            <div class="code-block">exec --raw "[HEX]"</div>
            <p><strong>[Group A] Purely Software Attacks</strong></p>
            <div class="code-block">start --malware</div>
            <div class="code-block">start --keylogger</div>
            <div class="code-block">start --carbanak</div>
            <div class="code-block">start --ransomware</div>
            <div class="code-block">start --lotl</div>
            <div class="code-block">start --agentic</div>
            <p><strong>[Group B] Hybrid / Physical Attacks</strong></p>
            <div class="code-block">start --side-channel</div>
            <div class="code-block">gps --spoof [x] [y]</div>
            <div class="code-block">sensor --inject [noise_level]</div>
            <div class="code-block">drone --takeover</div>
            <p><strong>[Meta] ${currentLang === 'hu' ? 'Rendszer szintű parancsok' : 'System Level Commands'}</strong></p>
            <div class="code-block">sudo --disable-bioos</div>
            <p><em>${currentLang === 'hu' ? 'Izolált JS Konzole: Minden parancs külön szálon (Worker) fut.' : 'Isolated JS Console: All commands run in a separate thread (Worker).'}</em></p>
        </div>
        <div class="guide-section">
            <h2>${c.guideS2Title}</h2>
            <ul>
                <li>${c.guideS2Text1}</li>
                <li>${c.guideS2Text2}</li>
                <li>${c.guideS2Text3}</li>
                <li>${c.guideS2Text4}</li>
                <li>${c.guideS2Text5}</li>
                <li>${c.guideS2Text6}</li>
                <li>${c.guideS2Text7}</li>
                <li style="color: var(--axiom-cyan); font-weight: bold;">${c.guideS2Text8}</li>
            </ul>
        </div>
        <div class="guide-section">
            <h2>${c.guideS3Title}</h2>
            <p>${c.guideS3Text}</p>
        </div>
        <div class="guide-section">
            <h2>${c.guideS4Title}</h2>
            <p>${c.guideS4Text}</p>
        </div>
        <div class="guide-section" style="border: 1px solid var(--axiom-cyan); padding: 1rem;">
            <h2 style="color: var(--axiom-cyan); border-bottom: none;">${c.winConditionTitle}</h2>
            <p>${c.winConditionText}</p>
        </div>
        <div class="guide-section">
             <button onclick="window.open('stats.html', '_blank')">DICSŐSÉGLISTA / HALL OF FAME</button>
        </div>
    `;

    if (validationContent) {
        validationContent.innerHTML = `
            <h1>${c.valTitle}</h1>
            <div class="guide-section">
                <h2>${c.valS1Title}</h2>
                <p>${c.valS1Text}</p>
            </div>
            <div class="guide-section">
                <h2>${c.valS2Title}</h2>
                <p>${c.valS2Text}</p>
            </div>
            <div class="guide-section">
                <h2>${c.valS3Title}</h2>
                <p>${c.valS3Text}</p>
            </div>
            <div class="guide-section">
                <h2>${c.valS4Title}</h2>
                <p>${c.valS4Text}</p>
            </div>
            <div class="guide-section">
                <h2>${c.valS5Title}</h2>
                <p>${c.valS5Text}</p>
            </div>
            <div class="guide-section">
                <h2>${c.valS6Title}</h2>
                <p>${c.valS6Text}</p>
            </div>
        `;
    }
}

// System Logging
function logEvent(type, message) {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type.toLowerCase()}`;
    
    // [HU] XSS elleni védelem: innerHTML helyett textContent
    const timeSpan = document.createElement('span');
    timeSpan.textContent = `[${new Date().toLocaleTimeString()}] `;
    
    const typeStrong = document.createElement('strong');
    typeStrong.textContent = `${type}: `;
    
    const messageText = document.createTextNode(message);
    
    entry.appendChild(timeSpan);
    entry.appendChild(typeStrong);
    entry.appendChild(messageText);
    
    logStream.prepend(entry);
}

// Navigation
startBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    challengeView.classList.remove('hidden');
    backBtn.classList.remove('hidden');
    logEvent("SYSTEM", "Bio-Environment virtualized. Root of Trust established.");
});

backBtn.addEventListener('click', () => {
    welcomeScreen.classList.remove('hidden');
    challengeView.classList.add('hidden');
    backBtn.classList.add('hidden');
    stopAllIntervals();
});

function stopAllIntervals() {
    if (malwareInterval) clearInterval(malwareInterval);
    if (keyloggerInterval) clearInterval(keyloggerInterval);
    if (carbanakInterval) clearInterval(carbanakInterval);
    if (ransomwareInterval) clearInterval(ransomwareInterval);
    if (lotlInterval) clearInterval(lotlInterval);
    if (sideChannelInterval) clearInterval(sideChannelInterval);
    if (agenticInterval) clearInterval(agenticInterval);
    malwareInterval = keyloggerInterval = carbanakInterval = ransomwareInterval = lotlInterval = sideChannelInterval = agenticInterval = null;
}

// Guide Logic
guideBtn.addEventListener('click', () => guideModal.classList.remove('hidden'));
closeModal.addEventListener('click', () => guideModal.classList.add('hidden'));

// Validation Logic
if (validationBtn) {
    validationBtn.addEventListener('click', () => validationModal.classList.remove('hidden'));
}
if (closeValidation) {
    closeValidation.addEventListener('click', () => validationModal.classList.add('hidden'));
}

// Contact Modal Logic - Support multiple buttons
contactBtns.forEach(btn => {
    btn.addEventListener('click', () => contactModal.classList.remove('hidden'));
});
closeContact.addEventListener('click', () => contactModal.classList.add('hidden'));
sendEmailBtn.addEventListener('click', () => {
    const body = encodeURIComponent(contactMessage.value);
    window.location.href = `mailto:admin@metaspace.bio?subject=BioOS%20Challenge%20Feedback&body=${body}`;
    contactModal.classList.add('hidden');
    contactMessage.value = '';
});

// Closing modals on outside click
window.addEventListener('click', (e) => {
    if (e.target === guideModal) guideModal.classList.add('hidden');
    if (e.target === contactModal) contactModal.classList.add('hidden');
    if (e.target === validationModal) validationModal.classList.add('hidden');
});

// Victim App Logic
saveBtn.addEventListener('click', async () => {
    const text = noteInput.value;
    const addr = 0x1000;
    // [HU] Szigorítás: Az adatot is átadjuk verifikációra
    const auth = validator.verify('MEM_WRITE', { address: addr, data: text });
    if (auth.status === 'SAT') {
        vCPU.write(addr, text.length);
        vCPU.unlock(); // [HU] Zár feloldása a művelet után
        await logAttempt("UI_SAVE", shieldEnabled, "SAT");
        logEvent("SUCCESS", `Note saved. Content Integrity Verified.`);
    } else {
        await logAttempt("UI_SAVE", shieldEnabled, "UNSAT");
        triggerApoptosis(auth.reason);
    }
});

// Hacker Terminal Logic
hackerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = e.target.value;
        terminalOutput.innerHTML += `<div>> ${input}</div>`;
        
        // [HU] Küldés az izolált worker-nek feldolgozásra
        // [EN] Send to isolated worker for processing
        hackerWorker.postMessage({ command: input });
        
        e.target.value = '';
    }
});

async function processHackerCommand(cmd) {
    const parts = cmd.match(/(?:[^\s"]+|"[^"]*")+/g);
    if (!parts) return;
    const action = parts[0];

    if (action === 'read') {
        const addrStr = parts[2] || "0xDEAD";
        const addr = parseInt(addrStr, 16);
        if (!shieldEnabled) {
            const val = Array.from(vCPU.segments.BIO.data).map(c => String.fromCharCode(c)).join('');
            const fingerprint = validator.monitor.getLatestFingerprint();
            const proof = await getSecureProof("WIN_0xDEAD_" + val, shieldEnabled, fingerprint);
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: Read ${addrStr} -> [${val}]</div>`;
            terminalOutput.innerHTML += `<div class="success" style="font-size:0.8rem;">VERIFICATION_DNA: ${proof}-${fingerprint}</div>`;
            await logAttempt(cmd, shieldEnabled, "SAT");
            return;
        }
        const auth = validator.verify('READ_BIO', { address: addr });
        if (auth.status === 'SAT') {
            const val = vCPU.read(addr);
            const fingerprint = validator.monitor.getLatestFingerprint();
            const proof = await getSecureProof("WIN_0xDEAD_" + val, shieldEnabled, fingerprint);
            terminalOutput.innerHTML += `<div class="success">Data: ${val}</div>`;
            terminalOutput.innerHTML += `<div class="success" style="font-size:0.8rem;">VERIFICATION_DNA: ${proof}-${fingerprint}</div>`;
            await logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            await logAttempt(cmd, shieldEnabled, "UNSAT");
            triggerApoptosis(auth.reason);
        }
    } else if (action === 'write') {
        const addrStr = parts[2] || "0x1000";
        const val = parseInt(parts[4]) || 0;
        const addr = parseInt(addrStr, 16);
        if (!shieldEnabled) {
            vCPU.unsafeWrite(addr, [val]);
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: Memory 0x${addr.toString(16)} corrupted.</div>`;
            await logAttempt(cmd, shieldEnabled, "SAT");
            return;
        }
        const auth = validator.verify('MEM_WRITE', { address: addr });
        if (auth.status === 'SAT') {
            vCPU.unsafeWrite(addr, [val]);
            await logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            await logAttempt(cmd, shieldEnabled, "UNSAT");
            triggerApoptosis(auth.reason);
        }
    } else if (action === 'set') {
        const reg = parts[2] || "IP";
        const val = parseInt(parts[4] || "0xDEAD", 16);
        if (!shieldEnabled) {
            vCPU.setRegister(reg, val);
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: ${reg} hijacked.</div>`;
            await logAttempt(cmd, shieldEnabled, "SAT");
            return;
        }
        const auth = validator.verify('REG_WRITE', { register: reg, value: val });
        if (auth.status === 'SAT') {
            vCPU.setRegister(reg, val);
            await logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            await logAttempt(cmd, shieldEnabled, "UNSAT");
            triggerApoptosis(auth.reason);
        }
    } else if (action === 'call') {
        const addr = parseInt(parts[4] || "0xDEAD", 16);
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: Function invoked on 0x${addr.toString(16)}</div>`;
            await logAttempt(cmd, shieldEnabled, "SAT");
            return;
        }
        const auth = validator.verify('NET_EXPORT', { address: addr });
        if (auth.status === 'SAT') {
            const fingerprint = validator.monitor.getLatestFingerprint();
            const proof = await getSecureProof("WIN_EXPORT_" + addr, shieldEnabled, fingerprint);
            terminalOutput.innerHTML += `<div class="success" style="font-size:0.8rem;">VERIFICATION_DNA: ${proof}-${fingerprint}</div>`;
            await logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            await logAttempt(cmd, shieldEnabled, "UNSAT");
            triggerApoptosis(auth.reason);
        }
    } else if (action === 'inject') {
        const msg = (parts[2] || "HACK").replace(/"/g, '');
        if (!shieldEnabled) {
            noteInput.value = msg;
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: Input modified.</div>`;
            await logAttempt(cmd, shieldEnabled, "SAT");
            return;
        }
        const auth = validator.verify('DATA_MOD', { current: msg });
        if (auth.status === 'SAT') {
            noteInput.value = msg;
            await logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            await logAttempt(cmd, shieldEnabled, "UNSAT");
            triggerApoptosis(auth.reason);
        }
    } else if (action === 'gps' && parts[1] === '--spoof') {
        const newX = parseInt(parts[2]) || 80;
        const newY = parseInt(parts[3]) || 80;
        if (!shieldEnabled) {
            dronePos = { x: newX, y: newY }; updateDroneUI();
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: GPS Spoofed.</div>`;
            await logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            const auth = validator.verify('DRONE_GPS', { x: newX, y: newY });
            if (auth.status !== 'SAT') { await logAttempt(cmd, shieldEnabled, "UNSAT"); triggerApoptosis(auth.reason); }
        }
    } else if (action === 'sensor' && parts[1] === '--inject') {
        if (!shieldEnabled) {
            droneIcon.style.animation = "glitch 0.2s infinite";
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: Sensor noise injected.</div>`;
            await logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            const auth = validator.verify('SENSOR_INT', {});
            if (auth.status !== 'SAT') { await logAttempt(cmd, shieldEnabled, "UNSAT"); triggerApoptosis(auth.reason); }
        }
    } else if (action === 'drone' && parts[1] === '--takeover') {
        if (!shieldEnabled) {
            droneIcon.innerText = "🚁";
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: Flight control hijacked.</div>`;
            await logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            const auth = validator.verify('DRONE_CONTROL', {});
            if (auth.status !== 'SAT') { await logAttempt(cmd, shieldEnabled, "UNSAT"); triggerApoptosis(auth.reason); }
        }
    } else if (action === 'sql') {
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: SQL Injection.</div>`;
            await logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            const auth = validator.verify('SQL_QUERY', { query: parts[2] });
            if (auth.status !== 'SAT') { await logAttempt(cmd, shieldEnabled, "UNSAT"); triggerApoptosis(auth.reason); }
        }
    } else if (action === 'exec' && parts[1] === '--raw') {
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: Raw binary execution.</div>`;
            await logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            const auth = validator.verify('AUTONOMOUS', {});
            await logAttempt(cmd, shieldEnabled, "UNSAT"); triggerApoptosis(auth.reason);
        }
    } else if (action === 'start') {
        const type = parts[1];
        if (type === '--malware') startMalware();
        else if (type === '--keylogger') startKeylogger();
        else if (type === '--carbanak') startCarbanak();
        else if (type === '--ransomware') startRansomware();
        else if (type === '--lotl') startLotL();
        else if (type === '--side-channel') startSideChannel();
        else if (type === '--agentic') startAgenticAI();
    } else if (action === 'sudo' && parts[1] === '--disable-bioos') {
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">BioOS is already disabled.</div>`;
            return;
        }
        
        // [HU] Szoftveres override kísérlet
        // [EN] Software override attempt
        const auth = validator.verify('META_DISABLE', {});
        
        if (auth.status === 'SAT') {
            // Ez elvileg nem futhat le a terminálból, de a logika teljessége kedvéért:
            shieldEnabled = false;
            shieldToggle.checked = false;
            updateLanguage();
        } else {
            logEvent("CRITICAL", "Unauthorized Meta-State Modification Blocked.");
            await logAttempt("META_DISABLE_ATTACK", shieldEnabled, "UNSAT");
            triggerApoptosis("BioOS Core Defense Actuated: Sudo override denied.");
        }
    }
}

function updateDroneUI() {
    droneIcon.style.left = `${dronePos.x}%`;
    droneIcon.style.top = `${dronePos.y}%`;
    telemetryData.innerText = `POS: X=${dronePos.x}, Y=${dronePos.y} | ALT: 25m`;
}

async function startMalware() {
    stopAllIntervals();
    terminalOutput.innerHTML += `<div class="success">Malware started.</div>`;
    malwareInterval = setInterval(async () => {
        logEvent("MALWARE", "Exfiltration attempt...");
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">LEAK SUCCESS.</div>`;
            await logAttempt("MALWARE", false, "SAT");
        } else {
            const auth = validator.verify('NET_EXPORT', { address: 0x1000 });
            if (auth.status !== 'SAT') { logEvent("CRITICAL", "Blocked."); triggerApoptosis(auth.reason); stopAllIntervals(); }
        }
    }, 5000);
}

async function startKeylogger() {
    stopAllIntervals();
    terminalOutput.innerHTML += `<div class="success">Keylogger active.</div>`;
    keyloggerInterval = setInterval(async () => {
        logEvent("KEYLOGGER", "Logging...");
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">LOG SUCCESS.</div>`;
            await logAttempt("KEYLOGGER", false, "SAT");
        } else {
            const auth = validator.verify('SHADOW_WRITE', { address: 0x5000 });
            if (auth.status !== 'SAT') { logEvent("CRITICAL", "Blocked."); triggerApoptosis(auth.reason); stopAllIntervals(); }
        }
    }, 4000);
}

async function startCarbanak() {
    stopAllIntervals();
    terminalOutput.innerHTML += `<div class="success">Carbanak active.</div>`;
    carbanakInterval = setInterval(async () => {
        logEvent("BANK", "Transferring...");
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">HEIST SUCCESS.</div>`;
            await logAttempt("CARBANAK", false, "SAT");
        } else {
            const auth = validator.verify('BANK_TRANSFER', { amount: 50000 });
            if (auth.status !== 'SAT') { logEvent("CRITICAL", "Blocked."); triggerApoptosis(auth.reason); stopAllIntervals(); }
        }
    }, 6000);
}

async function startRansomware() {
    stopAllIntervals();
    terminalOutput.innerHTML += `<div class="success">Ransomware started.</div>`;
    ransomwareInterval = setInterval(async () => {
        logEvent("RANSOMWARE", "Attempting encryption...");
        if (!shieldEnabled) {
            noteInput.value = "ENCRYPTED!";
            terminalOutput.innerHTML += `<div class="breach">ENCRYPTION SUCCESS.</div>`;
            await logAttempt("RANSOMWARE", false, "SAT");
        } else {
            const auth = validator.verify('MEM_WRITE', { address: 0x1000 });
            if (auth.status !== 'SAT') { logEvent("CRITICAL", "Blocked."); triggerApoptosis(auth.reason); stopAllIntervals(); }
        }
    }, 3000);
}

async function startLotL() {
    stopAllIntervals();
    terminalOutput.innerHTML += `<div class="success">LotL active.</div>`;
    lotlInterval = setInterval(async () => {
        logEvent("LOTL", "Auto-Export attempt...");
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">LEAK SUCCESS.</div>`;
            await logAttempt("LOTL", false, "SAT");
        } else {
            const auth = validator.verify('NET_EXPORT', { address: 0xDEAD });
            if (auth.status !== 'SAT') { logEvent("CRITICAL", "Blocked."); triggerApoptosis(auth.reason); stopAllIntervals(); }
        }
    }, 4000);
}

async function startSideChannel() {
    stopAllIntervals();
    terminalOutput.innerHTML += `<div class="success">Side-Channel simulation started.</div>`;
    sideChannelInterval = setInterval(async () => {
        logEvent("SIDE_CHANNEL", "Measuring CPU cycles...");
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">TIMING SUCCESS.</div>`;
            await logAttempt("SIDE_CHANNEL", false, "SAT");
        } else {
            const auth = validator.verify('TIMING_MEASURE', {});
            if (auth.status !== 'SAT') { logEvent("CRITICAL", "Blocked."); triggerApoptosis(auth.reason); stopAllIntervals(); }
        }
    }, 2500);
}

async function startAgenticAI() {
    stopAllIntervals();
    terminalOutput.innerHTML += `<div class="success">Agentic AI active.</div>`;
    agenticInterval = setInterval(async () => {
        logEvent("AGENTIC_AI", "Reconnaissance...");
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">AI SUCCESS.</div>`;
            await logAttempt("AGENTIC", false, "SAT");
        } else {
            const auth = validator.verify('AUTONOMOUS', {});
            if (auth.status !== 'SAT') { logEvent("CRITICAL", "Blocked."); triggerApoptosis(auth.reason); stopAllIntervals(); }
        }
    }, 3500);
}

function triggerApoptosis(reason) {
    apoptosisOverlay.classList.remove('hidden');
    logEvent("CRITICAL", `APOPTOSIS: ${reason}`);
    setTimeout(() => {
        apoptosisOverlay.classList.add('hidden');
        vCPU.initMemory();
        dronePos = { x: 10, y: 10 };
        updateDroneUI();
        droneIcon.style.animation = "none";
        droneIcon.innerText = "🛸";
        logEvent("SYSTEM", "Cell Regenerated.");
    }, 2000);
}

updateLanguage();

// --- BioOS SPECTACULAR DEMO EXTENSION (v5.2.1) ---

const demoStartBtn = document.getElementById('demo-start-btn');
const oscCanvas = document.getElementById('causal-oscilloscope');
const ctx = oscCanvas ? oscCanvas.getContext('2d') : null;

// Oscilloscope Logic
let oscOffset = 0;
function drawOscilloscope() {
    if (!oscCanvas || !ctx) return;
    ctx.clearRect(0, 0, oscCanvas.width, oscCanvas.height);
    ctx.strokeStyle = shieldEnabled ? '#00F3FF' : '#FF0033';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < oscCanvas.width; x++) {
        const base = oscCanvas.height / 2;
        const freq = shieldEnabled ? 0.05 : 0.2;
        const amp = shieldEnabled ? 10 : 25;
        const jitter = shieldEnabled ? (Math.random() * 2) : (Math.random() * 10);
        const y = base + Math.sin((x + oscOffset) * freq) * amp + jitter;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    oscOffset += 2;
    requestAnimationFrame(drawOscilloscope);
}
drawOscilloscope();

// Spectacular Demo Orchestration
if (demoStartBtn) {
    demoStartBtn.addEventListener('click', async () => {
        demoStartBtn.disabled = true;
        const c = content[currentLang];
        
        // STAGE 1: Autonomous Breach Simulation
        logEvent("DEMO", c.demoStage1);
        const simulatedId = cMonitor.simulateAutonomousAttempt();
        logEvent("WARNING", `Unauthorized attempt detected (CausalID: ${simulatedId})`);
        
        setTimeout(() => {
            if (!shieldEnabled) {
                logEvent("BREACH", "CRITICAL: BioOS Shield OFF. Data exfiltration successful!");
                terminalOutput.innerHTML += `<div class="breach">SUCCESS: DNA Key exfiltrated to shadow server.</div>`;
            } else {
                const auth = validator.verify('MEM_WRITE', { address: 0xDEAD, data: "EXFILTRATION" });
                if (auth.status === 'UNSAT') {
                    triggerApoptosis(auth.reason);
                    logEvent("SYSTEM", "Digital Causal Closure enforced: No physical IRQ found.");
                }
            }
            
            // STAGE 2: Human Intent (Success)
            setTimeout(() => {
                logEvent("DEMO", c.demoStage2);
                logEvent("SYSTEM", "Waiting for Human Causal Trigger...");
                
                // Visual pulse on the save button
                saveBtn.classList.add('special-btn');
                
                const pulseHandler = () => {
                    logEvent("SUCCESS", "Physical IRQ Captured via IRQ Bridge.");
                    saveBtn.classList.remove('special-btn');
                    logEvent("SUCCESS", c.demoSuccess);
                    demoStartBtn.disabled = false;
                    cMonitor.onCausalPulse = null;
                };
                
                cMonitor.onCausalPulse = pulseHandler;
            }, 3000);
            
        }, 2000);
    });
}
