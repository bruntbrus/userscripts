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

export type GMValue = string | number | boolean
export type GMResponseHandler = (resp: GMResponse) => void
export type GMResponseType = XMLHttpRequestResponseType | 'ms-stream'

declare const unsafeWindow: Window & typeof globalThis
declare const GM_info: GMInfo
declare function GM_deleteValue(key: string): Promise<void>
declare function GM_getValue(key: string, def?: GMValue): Promise<GMValue | void>
declare function GM_listValues(): Promise<string[]>
declare function GM_openInTab(url: string, background?: boolean): void
declare function GM_setClipboard(text: string): void
declare function GM_setValue(key: string, value: GMValue): Promise<void>
declare function GM_xmlhttpRequest(opts: GMRequestOptions): void

export const GM = {
  unsafeWindow,
  info: GM_info,
  deleteValue: GM_deleteValue,
  getValue: GM_getValue,
  listValues: GM_listValues,
  openInTab: GM_openInTab,
  setClipboard: GM_setClipboard,
  setValue: GM_setValue,
  xmlhttpRequest: GM_xmlhttpRequest,
}
