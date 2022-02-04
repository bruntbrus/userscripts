const { dirname, resolve } = require('path')
const { readFile, writeFile } = require('fs/promises')

const ROOT_DIR = dirname(__dirname)
const SRC_DIR = resolve(ROOT_DIR, 'src')
const BUILD_DIR = resolve(ROOT_DIR, 'build')
const DIST_DIR = resolve(ROOT_DIR, 'dist')

const fileOptions = { encoding: 'utf8' }

main()

function main() {
  run()
}

async function run() {
  const [headerJs, gmJs, utilsJs, footerJs] = await Promise.all([
    readFile(resolve(SRC_DIR, 'header.js'), fileOptions),
    readFile(resolve(BUILD_DIR, 'gm.js'), fileOptions),
    readFile(resolve(BUILD_DIR, 'utils.js'), fileOptions),
    readFile(resolve(SRC_DIR, 'footer.js'), fileOptions),
  ])
  const js = `${headerJs.trim()}\n\n${modWrap('./gm', gmJs.trim())}\n\n${modWrap('./utils', utilsJs.trim())}\n\n${footerJs}`
  await writeFile(resolve(DIST_DIR, 'utils.user.js'), js, fileOptions)
}

function modWrap(modName, js) {
  return `register("${modName}", (exports, module) => {\n${js}\n});`
}
