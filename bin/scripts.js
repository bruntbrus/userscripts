/** @typedef {import('./types').UserScript} UserScript */

/** @type {UserScript[]} */
module.exports = [
  {
    name: 'utils',
    target: 'dist/utils.user.js',
    main: 'src/utils.main.js',
    mods: ['build/gm/index.js', 'build/utils/index.js'],
    meta: {
      name: 'Utils',
      namespace: 'Tomas',
      grants: [
        'GM_deleteValue',
        'GM_getResourceURL',
        'GM_getValue',
        'GM_listValues',
        'GM_notification',
        'GM_openInTab',
        'GM_registerMenuCommand',
        'GM_setClipboard',
        'GM_setValue',
        'GM_xmlhttpRequest',
      ]
    },
  },
]
