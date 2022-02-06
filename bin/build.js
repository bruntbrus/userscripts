const { basename } = require('path')
const { getArg, modWrap, readSource, writeSource } = require('./utils')
const scripts = require('./scripts')

/** @typedef {import('./types').UserScript} UserScript */

const EOL = '\n'
const SRC_SEP = EOL.repeat(2) + '/'.repeat(80) + EOL.repeat(2)
const HEAD_JS_PATH = 'src/head.js'

/** @type {() => void} */
function main() {
  const scriptName = getArg('-s')
  if (!scriptName) return console.warn('Missing script name.')
  const script = scripts.find((script) => script.name === scriptName)
  if (script) {
    buildScript(script)
  } else {
    console.warn(`Script "${scriptName}" not found.`)
  }
}

/** @type {(script: UserScript) => Promise<void>} */
async function buildScript(script) {
  console.log('Build:', script.name)
  const [headSrc, metaSrc, mainSrc, ...modsSrc] = await Promise.all([
    buildSource(HEAD_JS_PATH),
    buildSource(script.meta),
    buildSource(script.main),
    ...script.mods.map((modPath) => buildSource(modPath, true)),
  ])
  const src = [metaSrc, headSrc, ...modsSrc, mainSrc].join(SRC_SEP) + EOL
  await writeSource(script.target, src)
  console.log('Script:', script.target)
  return
}

/** @type {(relPath: string, isMod?: boolean)} */
async function buildSource(relPath, isMod = false) {
  let src = await readSource(relPath)
  src = filterSource(relPath, src)
  if (isMod) {
    const modName = basename(relPath, '.js')
    src = modWrap(modName, './' + modName, src)
  }
  return src
}

/** @type {(relPath: string, src: string) => string} */
function filterSource(relPath, src) {
  console.log('Source:', relPath)
  return src.trim()
}

// Build!
main()
