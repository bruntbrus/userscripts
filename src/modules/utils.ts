import { GM } from './gm'
import type { GMInfo, GMResponse, GMResponseType, GMValue } from './gm'

export interface UtilsRequestOptions {
  binary?: boolean
  data?: string
  headers?: Record<string, string>
  overrideMimeType?: string
  password?: string
  responseType?: GMResponseType
  timeout?: number
  user?: string
}

export interface UtilsResponse {
  headers: string
  readyState: string
  status: number
  statusText: string
  text: string
}

const { unsafeWindow } = GM

const {
  Array: UnsafeArray,
  Error: UnsafeError,
  JSON: UnsafeJSON,
  Math: UnsafeMath,
  Object: UnsafeObject,
  Promise: UnsafePromise,
  String: UnsafeString,
} = unsafeWindow

let globalKeys: string[] | null = null

/** Validation methods. Run in unsafe window! */
const valid = {
  bool(value: unknown): boolean {
    if (typeof value !== 'boolean') throw UnsafeError(`Boolean expected.`)
    return true
  },
  func(value: unknown): boolean {
    if (typeof value !== 'function') throw UnsafeError(`Function expected.`)
    return true
  },
  num(value: unknown): boolean {
    if (!Number.isFinite(value)) throw UnsafeError(`Finite number expected.`)
    return true
  },
  obj(value: unknown): boolean {
    if (!value || typeof value !== 'object') throw UnsafeError(`Object expected.`)
    return true
  },
  str(value: unknown): boolean {
    if (typeof value !== 'string') throw UnsafeError(`String expected.`)
    return true
  },
}

/** Utility methods. Run in unsafe window! */
export const utils = {
  array<T>(...values: T[]): T[] {
    return values
  },
  copy<T>(...values: T[]): void {
    const text = values.map((value) => utils.str(value)).join('\n')
    GM.setClipboard(text)
  },
  delVal(key: string): Promise<void> {
    valid.str(key)
    return GM.deleteValue(key)
  },
  delay(duration: number): Promise<void> {
    valid.num(duration)
    return new UnsafePromise((res) => setTimeout(res, duration))
  },
  each<T>(array: ArrayLike<T>, fn: (value: T, i: number) => void): void {
    valid.obj(array) && valid.func(fn)
    UnsafeArray.prototype.forEach.call(array, fn)
  },
  eachKey<T>(obj: Record<string, T>, fn: (key: string, value: T, i: number) => void): void {
    valid.obj(obj) && valid.func(fn)
    UnsafeObject.keys(obj).forEach((key, i) => fn(key, obj[key], i))
  },
  filter<T>(array: ArrayLike<T>, fn: (value: T, i: number) => boolean): T[] {
    valid.obj(array) && valid.func(fn)
    return UnsafeArray.prototype.filter.call(array, fn)
  },
  filterKey<T>(obj: Record<string, T>, fn: (key: string, value: T, i: number) => boolean): T[] {
    valid.obj(obj) && valid.func(fn)
    return UnsafeObject.keys(obj).filter((key, i) => fn(key, obj[key], i)).map((key) => obj[key])
  },
  find<T>(array: ArrayLike<T>, fn: (value: T, i: number) => boolean): T | null {
    valid.obj(array) && valid.func(fn)
    return UnsafeArray.prototype.find.call(array, fn)
  },
  findKey<T>(obj: Record<string, T>, fn: (key: string, value: T, i: number) => boolean): T | null {
    valid.obj(obj) && valid.func(fn)
    const key = UnsafeObject.keys(obj).find((key, i) => fn(key, obj[key], i))
    return key ? obj[key] : null
  },
  getVal(key: string, def?: GMValue): Promise<GMValue | void> {
    valid.str(key)
    return GM.getValue(key, def)
  },
  globals(exclude = false): Record<string, unknown> {
    valid.bool(exclude)
    if (!globalKeys) {
      const iframe = document.createElement('iframe')
      document.body.appendChild(iframe)
      if (!iframe.contentWindow) throw UnsafeError('No content window in iframe.')
      globalKeys = UnsafeObject.keys(iframe.contentWindow)
      document.body.removeChild(iframe)
    }
    const globals: Record<string, unknown> = UnsafeObject.create(null)
    UnsafeObject.keys(unsafeWindow).forEach((key) => {
      if (exclude && key.startsWith('_')) return
      // @ts-ignore
      if (!globalKeys.includes(key)) globals[key] = unsafeWindow[key]
    })
    return globals
  },
  gmInfo(): GMInfo {
    return UnsafeObject.freeze({ ...GM.info })
  },
  hasProp(obj: Record<string, unknown>, prop: string): boolean {
    valid.obj(obj) && valid.str(prop)
    return UnsafeObject.prototype.hasOwnProperty.call(obj, prop)
  },
  index<T>(array: ArrayLike<T>, fn: (value: T, i: number) => boolean): number {
    valid.obj(array) && valid.func(fn)
    return UnsafeArray.prototype.findIndex.call(array, fn)
  },
  isArray<T>(value: unknown): value is T[] {
    return UnsafeArray.isArray(value)
  },
  isBool(value: unknown): value is boolean {
    return typeof value === 'boolean'
  },
  isEl<T extends Element>(value: unknown): value is T {
    return utils.type(value).endsWith('Element')
  },
  isFunc(value: unknown): value is Function {
    return typeof value === 'function'
  },
  isNode(value: unknown): value is Node {
    return utils.isObj(value) && typeof value.nodeType === 'number'
  },
  isNum(value: unknown): value is number {
    return typeof value === 'number'
  },
  isObj<T>(value: unknown): value is Record<string, T> {
    return value !== null && typeof value === 'object'
  },
  isRe(value: unknown): value is RegExp {
    return utils.type(value) === 'RegExp'
  },
  isStr(value: unknown): value is string {
    return typeof value === 'string'
  },
  isSym(value: unknown): value is Symbol {
    return typeof value === 'symbol'
  },
  listVal(): Promise<string[]> {
    return GM.listValues()
  },
  map<T, R>(array: ArrayLike<T>, fn: (value: T, i: number) => R): R[] {
    valid.obj(array) && valid.func(fn)
    // @ts-ignore
    return UnsafeArray.prototype.map.call(array, fn)
  },
  mapKey<T, R>(obj: Record<string, T>, fn: (key: string, value: T, i: number) => R): R[] {
    valid.obj(obj) && valid.func(fn)
    return UnsafeObject.keys(obj).map((key, i) => fn(key, obj[key], i))
  },
  noop(): void { },
  open(url: string): void {
    valid.str(url)
    GM.openInTab(url, false)
  },
  query<E extends HTMLElement>(sel: string, root: ParentNode = document): E | null {
    valid.str(sel) && valid.obj(root)
    return root.querySelector(sel)
  },
  queryAll<E extends HTMLElement>(sel: string, root: ParentNode = document): E[] {
    valid.str(sel) && valid.obj(root)
    return Array.from(root.querySelectorAll(sel))
  },
  randInt(max: number): number {
    valid.num(max)
    return UnsafeMath.floor(max * Math.random())
  },
  request: {
    send: sendRequest,
    get(url: string): Promise<UtilsResponse> {
      return sendRequest('GET', url)
    },
    post(url: string, data: string): Promise<UtilsResponse> {
      return sendRequest('POST', url, { data })
    },
  },
  script(src: string): Promise<HTMLScriptElement> {
    valid.str(src)
    return new UnsafePromise((resolve, reject) => {
      const el = document.createElement('script')
      el.src = src
      el.onload = () => cleanup() && resolve(el)
      el.onerror = (err) => cleanup() && reject(err)
      function cleanup() {
        el.onload = null
        el.onerror = null
        return true
      }
      document.head.appendChild(el)
    })
  },
  setVal(key: string, value: unknown): Promise<void> {
    valid.str(key)
    return GM.setValue(key, utils.str(value))
  },
  sheet(href: string): Promise<HTMLLinkElement> {
    valid.str(href)
    return new UnsafePromise((resolve, reject) => {
      const el = document.createElement('link')
      el.rel = 'stylesheet'
      el.href = href
      el.onload = () => cleanup() && resolve(el)
      el.onerror = (err) => cleanup() && reject(err)
      function cleanup() {
        el.onload = null
        el.onerror = null
        return true
      }
      document.head.appendChild(el)
    })
  },
  str(value: unknown): string {
    if (!value || typeof value !== 'object' || utils.isRe(value)) return UnsafeString(value)
    if (UnsafeArray.isArray(value)) return '[' + value.map(utils.str).join(',') + ']'
    return '{' + UnsafeObject.keys(value).map((key) => {
      // @ts-ignore
      const keyVal: unknown = value[key]
      let strVal: string
      if (typeof keyVal === 'function') {
        strVal = UnsafeString(keyVal)
        if (!/^function |\(?.*\)?\s*=>/.test(strVal)) strVal = 'function ' + keyVal
      } else {
        strVal = (typeof keyVal === 'string') ? UnsafeJSON.stringify(keyVal) : utils.str(keyVal)
      }
      return `${UnsafeJSON.stringify(key)}:${strVal}`
    }).join(',') + '}'
  },
  style(css: string): Promise<HTMLStyleElement> {
    valid.str(css)
    return new UnsafePromise((resolve, reject) => {
      const el = document.createElement('style')
      el.textContent = css
      el.onload = () => cleanup() && resolve(el)
      el.onerror = (err) => cleanup() && reject(err)
      function cleanup() {
        el.onload = null
        el.onerror = null
        return true
      }
      document.head.appendChild(el)
    })
  },
  type(value: unknown): string {
    return UnsafeObject.prototype.toString.call(value).slice(8, -1)
  },
}

/** Sends HTTP request. Runs in unsafe window! */
function sendRequest(method: string, url: string, opts: UtilsRequestOptions = {}): Promise<UtilsResponse> {
  valid.str(method) && valid.str(url) && valid.obj(opts)
  return new UnsafePromise((resolve, reject) => {
    GM.xmlhttpRequest({
      method: method.toUpperCase(),
      url,
      binary: opts.binary,
      data: opts.data,
      headers: opts.headers,
      overrideMimeType: opts.overrideMimeType,
      password: opts.password,
      responseType: opts.responseType,
      timeout: opts.timeout,
      user: opts.user,
      onabort: (resp) => reject(toUtilsResp(resp)),
      onerror: (resp) => reject(toUtilsResp(resp)),
      onload: (resp) => resolve(toUtilsResp(resp)),
    })
  })
}

function toUtilsResp(resp: GMResponse): UtilsResponse {
  return {
    headers: resp.responseHeaders,
    readyState: resp.readyState,
    status: resp.status,
    statusText: resp.statusText,
    text: resp.responseText,
  }
}
