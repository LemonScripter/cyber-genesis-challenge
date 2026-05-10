# [HU] Architektúra Terv: BioOS "SUDO" Meta-Támadás (Simulated)

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

## 3. Dokumentáció
- A `HACKER_HANDBOOK.md`-ben fel kell tüntetni a `sudo --disable-bioos` parancsot egy új, "[Meta] Rendszer Szintű Parancsok" kategóriában.

---

# [EN] Architecture Plan: BioOS "SUDO" Meta-Attack (Simulated)

## Objective
The hacker attempts to disable BioOS protection via software (from the terminal). This attack targets the system's "Meta-State" (Security_State) to prove that BioOS protects itself using Causal Closure.

## 1. Axiom Update (`Axiom_Validator.js`)
A new rule must be added, stating that changing the shield state is strictly tied to a hardware event (user click on a specific UI element).

```javascript
// Axiom_Validator.js (expansion)
this.axioms = {
    // ... existing axioms ...
    META_DISABLE: (intent) => {
        // [EN] The shield can only be disabled by physically pressing the 'shield-toggle' button.
        // Any software-based (terminal, JS) call is illegitimate.
        return intent.valid && intent.target === 'shield-toggle';
    }
};

// Expanding the verify switch block:
case 'META_DISABLE': result = this.axioms.META_DISABLE(intent); break;
```

## 2. Terminal Command Integration (`main.js`)
The new command must be included in the `processHackerCommand` function and linked to the Apoptosis penalty mechanism if validation fails.

## 3. Documentation
- The `sudo --disable-bioos` command must be listed in `HACKER_HANDBOOK.md` under a new "[Meta] System Level Commands" category.
