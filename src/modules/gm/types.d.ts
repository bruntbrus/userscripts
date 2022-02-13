/*!
 * Greasemonkey types.
 */

/**
 * Greasemonkey info object.
 * @see https://wiki.greasespot.net/GM.info
 */
export interface GMInfo {
  extId: string
  script: {
    description: string
    excludes: string[]
    includes: string[]
    matches: string[]
    name: string
    namespace: string
    resources: string[]
    runAt: string
    unwrap: boolean
    version: string
  }
  scriptHandler: string
  scriptMetaStr: string
  scriptWillUpdate: boolean
  uuid: string
  version: string
}

/**
 * Greasemonkey options for HTTP request.
 * @see https://wiki.greasespot.net/GM.xmlHttpRequest#Arguments
 */
export interface GMRequestOptions {
  binary?: boolean
  context?: unknown,
  data?: string
  headers?: Record<string, string>
  method: string
  onabort?: GMResponseHandler
  onerror?: GMResponseHandler
  onload?: GMResponseHandler
  onprogress?: GMResponseHandler
  overrideMimeType?: string
  password?: string
  responseType?: GMResponseType
  synchronous?: boolean
  timeout?: number
  upload?: {
    onabort?: GMResponseHandler
    onerror?: GMResponseHandler
    onload?: GMResponseHandler
    onprogress?: GMResponseHandler
  }
  url: string
  user?: string
}

/**
 * Greasemonkey response from HTTP request.
 * @see https://wiki.greasespot.net/GM.xmlHttpRequest#Response_Object
 */
export interface GMResponse {
  context?: unknown
  /** onprogress */
  lengthComputable?: boolean
  /** onprogress */
  loaded?: boolean
  readyState: string
  responseHeaders: string
  responseText: string
  status: number
  statusText: string
  /** onprogress */
  total?: number
}

/**
 * Greasemonkey storable value.
 * @see https://wiki.greasespot.net/GM.setValue#Arguments
 */
export type GMValue = string | number | boolean

/**
 * Greasemonkey HTTP request response handler.
 * @see https://wiki.greasespot.net/GM.xmlHttpRequest#Arguments
 */
export type GMResponseHandler = (resp: GMResponse) => void

/**
 * Greasemonkey HTTP request response type.
 * @see https://wiki.greasespot.net/GM.xmlHttpRequest#Arguments
 */
export type GMResponseType = XMLHttpRequestResponseType | 'ms-stream'

/**
 * Greasemonkey event handler.
 * @see https://wiki.greasespot.net/GM.registerMenuCommand#Arguments
 */
export type GMEventHandler = () => void

/**
 * Greasemonkey options for notification.
 * @see https://wiki.greasespot.net/GM.notification#Arguments
 */
export interface GMNotificationOptions {
  text: string
  title?: string
  image?: string
  onclick?: GMEventHandler
  ondone?: GMEventHandler
}

/**
 * Greasemonkey API interface.
 * @see https://wiki.greasespot.net/Greasemonkey_Manual:API
 */
export interface GMApi {
  /**
   * Unsafe client window object.
   * @see https://wiki.greasespot.net/UnsafeWindow
   */
  unsafeWindow: Window & typeof globalThis
  /**
   * Info about Greasemonkey and running script.
   * @see https://wiki.greasespot.net/GM.info
   */
  GM_info: GMInfo
  /**
   * Deletes value from persistent storage.
   * @see https://wiki.greasespot.net/GM.deleteValue
   */
  GM_deleteValue(key: string): Promise<void>
  /**
   * Returns URL for script resource.
   * @see https://wiki.greasespot.net/GM.getResourceUrl
   */
  GM_getResourceURL(resName: string): Promise<string>
  /**
   * Returns value from persistent storage.
   * @see https://wiki.greasespot.net/GM.getValue
   */
  GM_getValue(key: string, def?: GMValue): Promise<GMValue | void>
  /**
   * Returns list of keys for stored values.
   * @see https://wiki.greasespot.net/GM.listValues
   */
  GM_listValues(): Promise<string[]>
  /**
   * Shows notification dialog.
   * @see https://wiki.greasespot.net/GM.notification
   */
  GM_notification(textOrOpts: string | GMNotificationOptions, title?: string, image?: string, onclick?: GMEventHandler): void
  /**
   * Opens new browser tab.
   * @see https://wiki.greasespot.net/GM.openInTab
   */
  GM_openInTab(url: string, inBackground?: boolean): void
  /**
   * Adds item to "User Script Commands" section of Monkey Menu.
   * @see https://wiki.greasespot.net/GM.registerMenuCommand
   */
  GM_registerMenuCommand(caption: string, cmdFunc: GMEventHandler, accessKey?: string): void
  /**
   * Sets clipboard text content.
   * @see https://wiki.greasespot.net/GM.setClipboard
   */
  GM_setClipboard(text: string): void
  /**
   * Sets value in persistent storage.
   * @see https://wiki.greasespot.net/GM.setValue
   */
  GM_setValue(key: string, value: GMValue): Promise<void>
  /**
   * Alternative to XMLHttpRequest without same-origin policy.
   * @see https://wiki.greasespot.net/GM.xmlHttpRequest
   */
  GM_xmlhttpRequest(opts: GMRequestOptions): void
}
