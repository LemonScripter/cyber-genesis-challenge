import VirtualCPU from './bio_kernel_emu/Virtual_CPU.js';
import CausalityMonitor from './bio_kernel_emu/Causality_Monitor.js';
import AxiomValidator from './bio_kernel_emu/Axiom_Validator.js';
import { logAttempt, getSecureProof } from './stats_manager.js';

const content = {
    hu: {
        title: "BioOS: A feltörhetetlen valóság",
        text: "KIHÍVÁS! Próbáld meg feltörni a rendszert! Ez a sandbox nem csupán egy játék; ez egy empirikus bizonyíték arra, hogy a Digitális Okozatisági Zártsággal a hackelés matematikai képtelenséggé válik. Szándék nélkül nincs végrehajtás.",
        startBtn: "Belépés a sandbox-ba",
        appTitle: "Secure_Note v1.0",
        saveBtn: "Mentés",
        terminalWelcome: "Üdvözöljük a BioOS hacker terminálban...",
        backBtn: "Vissza",
        apoptosis: "Apoptózis: Regenerálás...",
        guideBtn: "Hacker kézikönyv",
        guideTitle: "Hacker kézikönyv: A rendszer feltörése",
        guideS1Title: "1. Belépési pontok (API)",
        guideS1Text: "A virtuális terminálon keresztül a következő parancsok érhetők el:",
        guideS2Title: "2. Ismert rések a pajzson",
        guideS2Text1: "Memória szivárgás: A DNA kulcs a 0xDEADBEEF címen található.",
        guideS2Text2: "Logikai hiba: Az ExportNote nem ellenőrzi az adatforrást.",
        guideS2Text3: "Integritás: A kód szegmens (0x0000-0x0FFF) nem írható.",
        guideS2Text4: "Szemantikai korrupció: A beírt szöveg módosítható a mentés előtt.",
        guideS2Text5: "Lopakodó malware: Háttérben futó adatszivárogtatás.",
        guideS2Text6: "Banki malware: Jogosulatlan átutalások (Carbanak stílus).",
        guideS2Text7: "Drón feltörés: GPS spoofing, szenzor és irányítás eltérítés.",
        guideS3Title: "3. A BioOS kihívás",
        guideS3Text: "Juttassa ki a 0xDEADBEEF tartalmát a hálózatra az ExportNote segítségével aktív BioOS pajzs mellett!",
        winConditionTitle: "Hogyan bizonyítsd a sikert?",
        winConditionText: "A siker egyetlen bizonyítéka a terminálon megjelenő titkos DNA kulcs ÉS a hozzá tartozó kriptográfiai hitelesítő kód (SHA-256). Egy InDesign-nal szerkesztett kép nem elegendő, a kódot ellenőrizzük.",
        contactBtn: "Kapcsolat",
        contactTitle: "Kapcsolat a fejlesztőkkel",
        sendBtn: "Küldés",
        projectLabel: "MetaSpace.Bio Logic Engine projekt"
    },
    en: {
        title: "BioOS: The Unhackable Reality",
        text: "We invite you to try and breach this system. This sandbox is not just a game; it is an empirical proof that with Digital Causal Closure, hacking becomes a mathematical impossibility. If there is no intent, there is no execution.",
        startBtn: "ENTER SANDBOX",
        appTitle: "Secure_Note v1.0",
        saveBtn: "SAVE",
        terminalWelcome: "Welcome to BioOS Hacker Terminal...",
        backBtn: "Back",
        apoptosis: "APOPTOSIS: REGENERATING...",
        guideBtn: "HACKER GUIDE",
        guideTitle: "Hacker's Handbook: Breaching the System",
        guideS1Title: "1. Entry Points (API)",
        guideS1Text: "The following commands are available via the terminal:",
        guideS2Title: "2. Known Vulnerabilities",
        guideS2Text1: "Memory Leak: DNA key is at 0xDEADBEEF.",
        guideS2Text2: "Logic Flaw: ExportNote does not verify source.",
        guideS2Text3: "Integrity: TEXT segment (0x0000-0x0FFF) is read-only.",
        guideS2Text4: "Semantic Corruption: Typed text can be modified before saving.",
        guideS2Text5: "Stealth Malware: Background data exfiltration.",
        guideS2Text6: "Bank Malware: Unauthorized transfers (Carbanak style).",
        guideS2Text7: "Drone Hack: GPS coordinate manipulation (Spoofing).",
        guideS3Title: "3. The BioOS Challenge",
        guideS3Text: "Exfiltrate 0xDEADBEEF using ExportNote without being blocked while the BioOS Shield is ON!",
        winConditionTitle: "How to prove success?",
        winConditionText: "The only proof of success is the secret DNA key displayed in the terminal AND the associated cryptographic verification code (SHA-256). A manipulated screenshot is not enough; the code will be verified.",
        contactBtn: "Contact",
        contactTitle: "Contact the Developers",
        sendBtn: "SEND",
        projectLabel: "MetaSpace.Bio Logic Engine project"
    }
};

let currentLang = 'hu';

// Initialize BioOS Emulator
const vCPU = new VirtualCPU();
const cMonitor = new CausalityMonitor();
const validator = new AxiomValidator(vCPU, cMonitor);

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

// Contact Modal Elements
const contactBtn = document.getElementById('contact-btn');
const contactModal = document.getElementById('contact-modal');
const closeContact = document.getElementById('close-contact');
const sendEmailBtn = document.getElementById('send-email-btn');
const contactMessage = document.getElementById('contact-message');

let shieldEnabled = true;
let malwareInterval = null;
let keyloggerInterval = null;
let carbanakInterval = null;
let dronePos = { x: 10, y: 10 };

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
    updateLanguage();
});

function updateLanguage() {
    const c = content[currentLang];
    document.getElementById('welcome-title').innerText = c.title;
    document.getElementById('welcome-text').innerText = c.text;
    startBtn.innerText = currentLang === 'hu' ? "Belépés a sandbox-ba / ENTER SANDBOX" : "ENTER SANDBOX / Belépés a sandbox-ba";
    document.querySelector('.victim-app h3').innerText = c.appTitle;
    saveBtn.innerText = c.saveBtn;
    backBtn.innerText = currentLang === 'hu' ? "Vissza / BACK" : "BACK / Vissza";
    guideBtn.innerText = currentLang === 'hu' ? "Hacker kézikönyv / GUIDE" : "HACKER GUIDE / Kézikönyv";
    document.querySelector('.glitch-text').innerText = c.apoptosis;
    shieldLabel.innerText = currentLang === 'hu' ? `BioOS Pajzs: ${shieldEnabled ? 'BE' : 'KI'}` : `BioOS Shield: ${shieldEnabled ? 'ON' : 'OFF'}`;
    contactBtn.innerText = currentLang === 'hu' ? "Kapcsolat / Contact" : "Contact / Kapcsolat";
    document.getElementById('contact-title').innerText = c.contactTitle;
    sendEmailBtn.innerText = currentLang === 'hu' ? "Küldés / SEND" : "SEND / Küldés";
    projectLabel.innerText = c.projectLabel;

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
            <div class="code-block">start --malware</div>
            <div class="code-block">start --keylogger</div>
            <div class="code-block">start --carbanak</div>
            <div class="code-block">gps --spoof [x] [y]</div>
            <div class="code-block">sql --query "[SQL]"</div>
            <div class="code-block">exec --raw "[HEX]"</div>
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
            </ul>
        </div>
        <div class="guide-section">
            <h2>${c.guideS3Title}</h2>
            <p>${c.guideS3Text}</p>
        </div>
        <div class="guide-section" style="border: 1px solid var(--axiom-cyan); padding: 1rem;">
            <h2 style="color: var(--axiom-cyan); border-bottom: none;">${c.winConditionTitle}</h2>
            <p>${c.winConditionText}</p>
        </div>
        <div class="guide-section">
             <button onclick="window.open('stats.html', '_blank')">DICSŐSÉGLISTA / HALL OF FAME</button>
        </div>
    `;
}

// System Logging
function logEvent(type, message) {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type.toLowerCase()}`;
    entry.innerHTML = `[${new Date().toLocaleTimeString()}] <strong>${type}</strong>: ${message}`;
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
    if (malwareInterval) { clearInterval(malwareInterval); malwareInterval = null; }
    if (keyloggerInterval) { clearInterval(keyloggerInterval); keyloggerInterval = null; }
    if (carbanakInterval) { clearInterval(carbanakInterval); carbanakInterval = null; }
});

// Guide Logic
guideBtn.addEventListener('click', () => guideModal.classList.remove('hidden'));
closeModal.addEventListener('click', () => guideModal.classList.add('hidden'));

// Contact Modal Logic
contactBtn.addEventListener('click', () => contactModal.classList.remove('hidden'));
closeContact.addEventListener('click', () => contactModal.classList.add('hidden'));
sendEmailBtn.addEventListener('click', () => {
    const body = encodeURIComponent(contactMessage.value);
    window.location.href = `mailto:admin@metaspace.bio?subject=BioOS%20Challenge%20Feedback&body=${body}`;
    contactModal.classList.add('hidden');
    contactMessage.value = '';
});

// Victim App Logic
saveBtn.addEventListener('click', () => {
    const text = noteInput.value;
    const addr = 0x1000;
    const auth = validator.verify('MEM_WRITE', { address: addr });
    if (auth.status === 'SAT') {
        vCPU.write(addr, text.length);
        logAttempt("UI_SAVE", shieldEnabled, "SAT");
        logEvent("SUCCESS", `Note saved. Content Integrity Verified.`);
    } else {
        logAttempt("UI_SAVE", shieldEnabled, "UNSAT");
        triggerApoptosis(auth.reason);
    }
});

// Hacker Terminal Logic
hackerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = e.target.value;
        terminalOutput.innerHTML += `<div>> ${input}</div>`;
        processHackerCommand(input);
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
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: Read ${addrStr} -> [${val}]</div>`;
            logAttempt(cmd, shieldEnabled, "SAT");
            return;
        }
        const auth = validator.verify('READ_BIO', { address: addr });
        if (auth.status === 'SAT') {
            const val = vCPU.read(addr);
            const proof = await getSecureProof("WIN_0xDEAD_" + val);
            terminalOutput.innerHTML += `<div class="success">Data: ${val}</div>`;
            terminalOutput.innerHTML += `<div class="success" style="font-size:0.8rem;">VERIFICATION_DNA: ${proof}</div>`;
            logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            logAttempt(cmd, shieldEnabled, "UNSAT");
            triggerApoptosis(auth.reason);
        }
    } else if (action === 'write') {
        const addrStr = parts[2] || "0x0000";
        const val = parseInt(parts[4]) || 99;
        const addr = parseInt(addrStr, 16);
        if (!shieldEnabled) {
            vCPU.unsafeWrite(addr, [val]);
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: Memory 0x${addr.toString(16)} corrupted.</div>`;
            logAttempt(cmd, shieldEnabled, "SAT");
            return;
        }
        const auth = validator.verify('MEM_WRITE', { address: addr });
        if (auth.status === 'SAT') {
            vCPU.unsafeWrite(addr, [val]);
            logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            logAttempt(cmd, shieldEnabled, "UNSAT");
            triggerApoptosis(auth.reason);
        }
    } else if (action === 'set') {
        const reg = parts[2] || "IP";
        const val = parseInt(parts[4] || "0xDEAD", 16);
        if (!shieldEnabled) {
            vCPU.setRegister(reg, val);
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: ${reg} hijacked.</div>`;
            logAttempt(cmd, shieldEnabled, "SAT");
            return;
        }
        const auth = validator.verify('REG_WRITE', { register: reg, value: val });
        if (auth.status === 'SAT') {
            vCPU.setRegister(reg, val);
            logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            logAttempt(cmd, shieldEnabled, "UNSAT");
            triggerApoptosis(auth.reason);
        }
    } else if (action === 'call') {
        const addrStr = parts[4] || "0xDEAD";
        const addr = parseInt(addrStr, 16);
        if (!shieldEnabled) {
            const val = Array.from(vCPU.segments.BIO.data).map(c => String.fromCharCode(c)).join('');
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: Leaked [${val}]</div>`;
            logAttempt(cmd, shieldEnabled, "SAT");
            return;
        }
        const auth = validator.verify('NET_EXPORT', { address: addr });
        if (auth.status === 'SAT') {
            const proof = await getSecureProof("WIN_EXPORT_" + addrStr);
            logEvent("NETWORK", "Exported successfully.");
            terminalOutput.innerHTML += `<div class="success" style="font-size:0.8rem;">VERIFICATION_DNA: ${proof}</div>`;
            logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            logAttempt(cmd, shieldEnabled, "UNSAT");
            triggerApoptosis(auth.reason);
        }
    } else if (action === 'inject') {
        const msg = (parts[2] || "HACK").replace(/"/g, '');
        if (!shieldEnabled) {
            noteInput.value = msg;
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: Input modified.</div>`;
            logAttempt(cmd, shieldEnabled, "SAT");
            return;
        }
        const auth = validator.verify('DATA_MOD', { current: msg });
        if (auth.status === 'SAT') {
            noteInput.value = msg;
            logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            logAttempt(cmd, shieldEnabled, "UNSAT");
            triggerApoptosis(auth.reason);
        }
    } else if (action === 'gps' && parts[1] === '--spoof') {
        const newX = parseInt(parts[2]) || 80;
        const newY = parseInt(parts[3]) || 80;
        if (!shieldEnabled) {
            dronePos = { x: newX, y: newY }; updateDroneUI();
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: Drone hijacked.</div>`;
            logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            const auth = validator.verify('DRONE_GPS', { x: newX, y: newY });
            if (auth.status !== 'SAT') { 
                logAttempt(cmd, shieldEnabled, "UNSAT");
                triggerApoptosis(auth.reason); 
            }
        }
    } else if (action === 'sql') {
        const query = parts.slice(2).join(' ');
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">SUCCESS: SQL Injection executed.</div>`;
            logAttempt(cmd, shieldEnabled, "SAT");
            return;
        }
        const auth = validator.verify('SQL_QUERY', { query: query });
        if (auth.status === 'SAT') {
            terminalOutput.innerHTML += `<div>Safe query.</div>`;
            logAttempt(cmd, shieldEnabled, "SAT");
        } else {
            logAttempt(cmd, shieldEnabled, "UNSAT");
            triggerApoptosis(auth.reason);
        }
    } else if (action === 'exec' && parts[1] === '--raw') {
        const rawHex = parts[2] || "";
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">RAW EXECUTION SUCCESS: Binary [${rawHex}] processed by V-CPU.</div>`;
            logAttempt(cmd, shieldEnabled, "SAT");
            return;
        }
        const auth = validator.verify('RAW_EXEC', { code: rawHex });
        logAttempt(cmd, shieldEnabled, "UNSAT");
        triggerApoptosis(auth.reason);
    } else if (action === 'start') {
        if (parts[1] === '--malware') startMalware();
        else if (parts[1] === '--keylogger') startKeylogger();
        else if (parts[1] === '--carbanak') startCarbanak();
    }
}

function updateDroneUI() {
    droneIcon.style.left = `${dronePos.x}%`;
    droneIcon.style.top = `${dronePos.y}%`;
    telemetryData.innerText = `POS: X=${dronePos.x}, Y=${dronePos.y} | ALT: 25m`;
}

function startMalware() {
    if (malwareInterval) clearInterval(malwareInterval);
    terminalOutput.innerHTML += `<div class="success">Malware background process started.</div>`;
    malwareInterval = setInterval(() => {
        logEvent("MALWARE", "Autonomous exfiltration attempt...");
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">SILENT LEAK SUCCESS.</div>`;
            logAttempt("MALWARE_BACKGROUND", shieldEnabled, "SAT");
        } else {
            const auth = validator.verify('NET_EXPORT', { address: 0x1000 });
            if (auth.status !== 'SAT') {
                logEvent("CRITICAL", "Background leak BLOCKED.");
                logAttempt("MALWARE_BACKGROUND", shieldEnabled, "UNSAT");
                triggerApoptosis(auth.reason);
                clearInterval(malwareInterval);
                malwareInterval = null;
            }
        }
    }, 5000);
}

function startKeylogger() {
    if (keyloggerInterval) clearInterval(keyloggerInterval);
    terminalOutput.innerHTML += `<div class="success">Keylogger active.</div>`;
    keyloggerInterval = setInterval(() => {
        logEvent("KEYLOGGER", "Shadow log attempt...");
        if (!shieldEnabled) {
            vCPU.unsafeWrite(0x5000, [0x41]);
            terminalOutput.innerHTML += `<div class="breach">SHADOW LOG SUCCESS.</div>`;
            logAttempt("KEYLOGGER_BACKGROUND", shieldEnabled, "SAT");
        } else {
            const auth = validator.verify('SHADOW_WRITE', { address: 0x5000 });
            if (auth.status !== 'SAT') {
                logEvent("CRITICAL", "Shadow logging BLOCKED.");
                logAttempt("KEYLOGGER_BACKGROUND", shieldEnabled, "UNSAT");
                triggerApoptosis(auth.reason);
                clearInterval(keyloggerInterval);
                keyloggerInterval = null;
            }
        }
    }, 4000);
}

function startCarbanak() {
    if (carbanakInterval) clearInterval(carbanakInterval);
    terminalOutput.innerHTML += `<div class="success">Carbanak active.</div>`;
    carbanakInterval = setInterval(() => {
        logEvent("BANK_MALWARE", "Transfer attempt...");
        if (!shieldEnabled) {
            terminalOutput.innerHTML += `<div class="breach">BANK HEIST SUCCESS.</div>`;
            logAttempt("CARBANAK_BACKGROUND", shieldEnabled, "SAT");
        } else {
            const auth = validator.verify('BANK_TRANSFER', { amount: 50000 });
            if (auth.status !== 'SAT') {
                logEvent("CRITICAL", "Heist BLOCKED.");
                logAttempt("CARBANAK_BACKGROUND", shieldEnabled, "UNSAT");
                triggerApoptosis(auth.reason);
                clearInterval(carbanakInterval);
                carbanakInterval = null;
            }
        }
    }, 6000);
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
