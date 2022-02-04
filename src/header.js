// ==UserScript==
// @name Utils
// @namespace Tomas
// @match *://*/*
// @grant GM_deleteValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// ==/UserScript==

function require(modName) {
  const { modMap } = register;
  if (!modMap.has(modName)) throw Error(`Module "${modName}" is not registered.`);
  const mod = modMap.get(modName);
  if (mod.exported) return mod.exports;
  mod.fn.call(undefined, mod.exports);
  mod.exported = true;
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
