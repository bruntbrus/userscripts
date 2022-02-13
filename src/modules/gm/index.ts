/*!
 * Greasemonkey.
 * https://wiki.greasespot.net/Greasemonkey_Manual
 */

import type { GMApi } from './types'

declare global {
  interface Window extends GMApi {}
}

/**
 * Greasemonkey API.
 * @see https://wiki.greasespot.net/Greasemonkey_Manual:API
 */
export const GM = Object.freeze({
  unsafeWindow: window.unsafeWindow,
  info: window.GM_info,
  deleteValue: window.GM_deleteValue,
  getResourceURL: window.GM_getResourceURL,
  getValue: window.GM_getValue,
  listValues: window.GM_listValues,
  notification: window.GM_notification,
  openInTab: window.GM_openInTab,
  registerMenuCommand: window.GM_registerMenuCommand,
  setClipboard: window.GM_setClipboard,
  setValue: window.GM_setValue,
  xmlhttpRequest: window.GM_xmlhttpRequest,
})
