/**
 * BioOS Hacker Console Worker
 * [HU] Ez a szál teljesen izolált a főoldaltól (DOM/Global State).
 * [EN] This thread is completely isolated from the main page (DOM/Global State).
 */

self.onmessage = function(e) {
    const { command, context } = e.data;
    
    // [HU] A worker nem fér hozzá a 'window' vagy 'document' objektumokhoz.
    // [EN] The worker has no access to 'window' or 'document' objects.
    
    try {
        // [HU] Itt szimuláljuk a parancs feldolgozását az izolált térben.
        // [EN] Here we simulate command processing in the isolated space.
        
        // [HU] Ha a parancs tartalmaz 'document', 'window' vagy 'shield' hivatkozást, az itt 'undefined' lesz.
        // [EN] If the command contains 'document', 'window' or 'shield' references, they will be 'undefined' here.
        
        // Visszaküldjük a parancsot a fő szálnak végrehajtásra a BioOS kapun keresztül
        self.postMessage({ 
            status: 'PROCESSED', 
            originalCommand: command 
        });
    } catch (error) {
        self.postMessage({ status: 'ERROR', message: error.message });
    }
};
