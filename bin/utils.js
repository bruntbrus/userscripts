const { dirname, resolve } = require('path')
const { readFile, writeFile } = require('fs/promises')

/** Path to root directory. */
const ROOT_DIR = dirname(__dirname)
/** Text file options. */
const TEXT_FILE = { encoding: 'utf8' }

/** Utilities. */
const utils = {
  ROOT_DIR,
  TEXT_FILE,

  /** @type {(argName: string) => string} */
  getArg(argName) {
    const { argv } = process
    const i = argv.findIndex((arg) => arg === argName) + 1
    return (i > 0 && i < argv.length ? argv[i].trim() : '')
  },

  /** @type {(relPath: string) => string} */
  getPath(relPath) {
    return resolve(ROOT_DIR, relPath)
  },

  /** @type {(modName: string, modPath: string, bodyJs: string) => string} */
  modWrap(modName, modPath, bodyJs) {
    return `register("${modPath}", function ${modName}Module(exports, module) {\n${bodyJs}\n});`
  },

  /** @type {(relPath: string) => Promise<string>} */
  async readSource(relPath) {
    return await readFile(utils.getPath(relPath), TEXT_FILE)
  },

  /** @type {(relPath: string, src: string) => Promise<void>} */
  async writeSource(relPath, src) {
    await writeFile(utils.getPath(relPath), src, TEXT_FILE)
  },
}

module.exports = utils
