/** @typedef {import('./types').UserScript} UserScript */

/** @type {UserScript[]} */
module.exports = [
  {
    name: 'utils',
    target: 'dist/utils.user.js',
    meta: 'src/utils.meta.js',
    main: 'src/utils.main.js',
    mods: ['build/gm.js', 'build/utils.js'],
  },
]
