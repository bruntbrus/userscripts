/** @typedef {import('./types').GMMetadata} GMMetadata */

/** Pattern to match all sites. */
const MATCH_ALL = '*://*/*'

module.exports = {
  MATCH_ALL,

  /**
   * Returns Greasemonkey meta data block.
   * @see https://wiki.greasespot.net/Metadata_Block
   * @type {(meta: GMMetadata) => string}
   */
  createMetadataBlock(meta) {
    const lines = ['// ==UserScript==']
    /** @type {(name: string, value?: unknown) => void} */
    function addData(name, value) {
      lines.push('// @' + name + (value === undefined ? '' : ' ' + String(value)))
    }
    if (!meta.name) throw Error('Name missing.')
    addData('name', meta.name)
    if (meta.namespace) addData('namespace', meta.namespace)
    if (meta.description) addData('description', meta.description)
    if (meta.version) addData('version', meta.version)
    if (meta.icon) addData('icon', meta.icon)
    if (meta.runAt) addData('run-at', meta.runAt)
    if (meta.noframes) addData('noframes')
    if (meta.matches) meta.matches.forEach((match) => addData('match', match))
    else addData('match', MATCH_ALL)
    if (meta.grants) meta.grants.forEach((grant) => addData('grant', grant))
    if (meta.includes) meta.includes.forEach((include) => addData('include', include))
    if (meta.excludes) meta.excludes.forEach((exclude) => addData('exclude', exclude))
    if (meta.requires) meta.requires.forEach((req) => addData('require', req))
    if (meta.resources) meta.resources.forEach((res) => addData('resource', res))
    lines.push('// ==/UserScript==')
    return lines.join('\n')
  }
}
