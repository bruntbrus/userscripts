/**
 * Greasemonkey UserScript details for build.
 * @see https://wiki.greasespot.net/User_script
 */
export interface UserScript {
  name: string
  target: string
  main: string
  mods: string[]
  meta: GMMetadata
}

/**
 * Greasemonkey metadata.
 * @see https://wiki.greasespot.net/Metadata_Block
 */
export interface GMMetadata {
  name: string
  description?: string
  excludes?: string[]
  grants?: (keyof GMApi)[]
  icon?: string
  includes?: string[]
  matches?: string[]
  namespace?: string
  noframes?: boolean
  requires?: string[]
  resources?: string[]
  runAt?: 'document-start' | 'document-end' | 'document-idle'
  version?: string
}
