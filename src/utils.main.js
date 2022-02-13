(function main() {
    "use strict";
    const { GM } = require("gm");
    const { utils } = require("utils");
    GM.unsafeWindow._utils = Object.freeze(utils);
    console.log("Utils loaded.");
})();
