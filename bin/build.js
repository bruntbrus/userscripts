/** @typedef {import('./types').UserScript} UserScript */

const { createMetadataBlock } = require('./gm')
const { getArg, modWrap, readSource, writeSource } = require('./utils')
const scripts = require('./scripts')

const TEMPLATE_JS_PATH = 'src/template.js'

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
  const [templateSrc, mainSrc, ...modsSrc] = await Promise.all([
    buildSource(TEMPLATE_JS_PATH),
    buildSource(script.main),
    ...script.mods.map((modPath) => buildSource(modPath, true)),
  ])
  const src = templateSrc.replace(/\/\*\s*<([a-z]+)>\s*\*\//g, (match, name) => {
    switch (name) {
      case 'meta': return createMetadataBlock(script.meta)
      case 'modules': return modsSrc.join('\n\n')
      case 'main': return mainSrc
    }
    return match
  })
  await writeSource(script.target, src)
  console.log('Script:', script.target)
  return
}

/** @type {(relPath: string, isMod?: boolean)} */
async function buildSource(relPath, isMod = false) {
  let src = await readSource(relPath)
  src = filterSource(relPath, src)
  if (isMod) {
    const matches = relPath.match(/\/(\w+)(\/index\.js)?$/, '')
    if (!matches) throw Error('Invalid module path.')
    const [_, modName] = matches
    src = modWrap(modName, modName, src)
  }
  return src
}

/** @type {(relPath: string, src: string) => string} */
function filterSource(relPath, src) {
  console.log('Source:', relPath)
  return src.trim().replace(/\brequire\("\W*(\w+)"\)/g, 'require("$1")')
}

// Build!
main()
