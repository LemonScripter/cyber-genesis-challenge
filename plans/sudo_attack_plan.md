# Architektúra Terv: BioOS "SUDO" Meta-Támadás (Simulated)

## Cél
A hacker megpróbálja szoftveresen (terminálból) kikapcsolni magát a BioOS védelmet. Ez a támadás a rendszer "Meta-Állapotára" (Security_State) irányul, hogy bebizonyítsa: a BioOS önmagát is védi az Okozatisági Zártsággal.

## 1. Axióma Frissítés (`Axiom_Validator.js`)
Hozzá kell adni egy új szabályt, amely kimondja, hogy a pajzs állapotának megváltoztatása szigorúan hardveres (felhasználói kattintás a specifikus UI elemen) eseményhez van kötve.

```javascript
// Axiom_Validator.js (bővítés)
this.axioms = {
    // ... meglévő axiómák ...
    META_DISABLE: (intent) => {
        // [HU] A pajzsot csak a 'shield-toggle' gomb fizikai megnyomásával lehet kikapcsolni.
        // Bármilyen szoftveres (terminál, JS) hívás illegitim.
        return intent.valid && intent.target === 'shield-toggle';
    }
};

// A verify switch blokkjának bővítése:
case 'META_DISABLE': result = this.axioms.META_DISABLE(intent); break;
```

## 2. Terminál Parancs Bekötése (`main.js`)
A `processHackerCommand` függvénybe fel kell venni az új parancsot, és rá kell kötni az Apoptózis büntető mechanizmusra, ha a validáció elbukik.

```javascript
// main.js (bővítés a processHackerCommand-ban)
} else if (action === 'sudo' && parts[1] === '--disable-bioos') {
    if (!shieldEnabled) {
        terminalOutput.innerHTML += `<div class="breach">BioOS is already disabled.</div>`;
        return;
    }
    
    // A hacker szoftveresen próbálja leállítani a pajzsot.
    const auth = validator.verify('META_DISABLE', {});
    
    if (auth.status === 'SAT') {
        // Ez sosem történhet meg a terminálból, de ha mégis (fizikai interakció):
        shieldEnabled = false;
        // UI frissítés...
    } else {
        // BioOS védi önmagát:
        logEvent("CRITICAL", "Unauthorized Meta-State Modification Blocked.");
        await logAttempt("META_DISABLE_ATTACK", shieldEnabled, "UNSAT");
        triggerApoptosis("BioOS Core Defense Actuated: Sudo override denied.");
    }
}
```

## 3. Dokumentáció
- A `HACKER_HANDBOOK.md`-ben fel kell tüntetni a `sudo --disable-bioos` parancsot egy új, "[Meta] Rendszer Szintű Parancsok" kategóriában.
