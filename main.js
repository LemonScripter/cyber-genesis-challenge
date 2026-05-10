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

let currentLang = localStorage.getItem('bioos_lang') || 'hu';

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
    return await getSecureProof(data);
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
});

// Victim App Logic
saveBtn.addEventListener('click', async () => {
    const text = noteInput.value;
    const addr = 0x1000;
    const auth = validator.verify('MEM_WRITE', { address: addr });
    if (auth.status === 'SAT') {
        vCPU.write(addr, text.length);
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
            await logAttempt(cmd, shieldEnabled, "SAT");
            return;
        }
        const auth = validator.verify('READ_BIO', { address: addr });
        if (auth.status === 'SAT') {
            const val = vCPU.read(addr);
            const proof = await getSecureProof("WIN_0xDEAD_" + val);
            terminalOutput.innerHTML += `<div class="success">Data: ${val}</div>`;
            terminalOutput.innerHTML += `<div class="success" style="font-size:0.8rem;">VERIFICATION_DNA: ${proof}</div>`;
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
            const proof = await getSecureProof("WIN_EXPORT_" + addr);
            terminalOutput.innerHTML += `<div class="success" style="font-size:0.8rem;">VERIFICATION_DNA: ${proof}</div>`;
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
