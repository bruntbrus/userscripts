/* <meta> */

function require(modName) {
    const { modMap } = register;
    if (!modMap.has(modName)) throw Error(`Module "${modName}" is not registered.`);
    const mod = modMap.get(modName);
    if (mod._exported) return mod.exports;
    mod.fn.call(undefined, mod.exports, mod);
    mod._exported = true;
    return mod.exports;
}

function register(modName, modFn) {
    const { modMap } = register;
    modMap.set(modName, {
        name: modName,
        fn: modFn,
        exports: {},
        exported: false,
    });
}

register.modMap = new Map();

/* <modules> */

;(function main() { "use strict";

/* <main> */

})();
