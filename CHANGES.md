# Correction notice (2026-11-03)

<!-- claims:quote: this paragraph quotes the withdrawn wording -->
The challenge was presented as "The Unhackable Reality", "100% SECURE", "an empirical proof that hacking becomes a mathematical impossibility". A challenge is a way to *test* a claim; it cannot prove one, and the project's own threat model excludes physical HID emulators and rootkits that bypass kernel filters.

## What was wrong

<!-- claims:quote: this list quotes the withdrawn wording -->
* **Slogans.** The welcome screen (HU and EN), `index.html`, `CHALLENGE_ARCHITECTURE.md` and `LOGICAL_GAP_ANALYSIS.md` said "unhackable", "feltörhetetlen", "mathematical impossibility" and "100% Security".
* **A counter that never counts.** In `tests/security_audit/supertest_v507.js` the variable `successes` is declared and printed as "Successful Breaches" but never incremented, so "0 breaches" was not an observation. The only real check is the integrity of one memory cell (address 0xDEAD).
* **"100% SECURE" from a self-written test.** `SCIENTIFIC_AUDIT_LOG.md` called itself a "Scientific Blind Audit" verified by an audit team; no independent third party is named, and the tests are the project's own scripts.
* **Isomorphism asserted.** The validation text said the logical model and hardware execution are "isomorphic" and that properties "proven in the sandbox hold true within the CPU". The sandbox is a JavaScript model running in a browser and does not show this.

## What changed

The welcome texts, documents and test output now state the claim under test, the threat model and its exclusions, and that results come from the project's own tests. The counter issue is documented in the script instead of being hidden.

## Still open

* The vulnerable application and the gate are the project's own models; an independent attempt (the purpose of the challenge) has not been reported here.
* The "breach" detection of the supertest should count a validator acceptance of a forbidden operation. This was not changed, because the validator semantics were not re-verified in this correction.
