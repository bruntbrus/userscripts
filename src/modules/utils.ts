import { GM } from './gm'
import type { GMInfo, GMResponse, GMResponseType, GMValue } from './gm'

export interface RequestOptions {
  binary?: boolean
  data?: string
  headers?: Record<string, string>
  overrideMimeType?: string
  password?: string
  responseType?: GMResponseType
  timeout?: number
  user?: string
}

export interface CustomResponse {
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
    return value
  },
  func(value: unknown): Function {
    if (typeof value !== 'function') throw UnsafeError(`Function expected.`)
    return value
  },
  num(value: unknown): number {
    if (!Number.isFinite(value)) throw UnsafeError(`Number expected.`)
    // @ts-ignore
    return value
  },
  obj(value: unknown): object {
    if (!value || typeof value !== 'object') throw UnsafeError(`Object expected.`)
    return value
  },
  str(value: unknown): string {
    if (typeof value !== 'string') throw UnsafeError(`String expected.`)
    return value
  },
}

/** Utility methods. Run in unsafe window! */
export const utils = Object.freeze({
  _gm: GM,
  array<T>(...values: T[]): T[] {
    return values
  },
  copy<T>(...values: T[]): void {
    const text = values.map((value) => utils.str(value)).join('\n')
    GM.setClipboard(text)
  },
  delVal(key: string): Promise<void> {
    return GM.deleteValue(valid.str(key))
  },
  delay(duration: number): Promise<void> {
    valid.num(duration)
    return new UnsafePromise((res) => setTimeout(res, duration))
  },
  each<T>(array: ArrayLike<T>, fn: (value: T, i: number) => void): void {
    valid.func(fn)
    UnsafeArray.prototype.forEach.call(valid.obj(array), fn)
  },
  eachKey<T>(obj: Record<string, T>, fn: (key: string, value: T, i: number) => void): void {
    valid.func(fn)
    UnsafeObject.keys(valid.obj(obj)).forEach((key, i) => fn(key, obj[key], i))
  },
  filter<T>(array: ArrayLike<T>, fn: (value: T, i: number) => boolean): T[] {
    valid.func(fn)
    return UnsafeArray.prototype.filter.call(valid.obj(array), fn)
  },
  filterKey<T>(obj: Record<string, T>, fn: (key: string, value: T, i: number) => boolean): T[] {
    valid.func(fn)
    return UnsafeObject.keys(valid.obj(obj)).filter((key, i) => fn(key, obj[key], i)).map((key) => obj[key])
  },
  find<T>(array: ArrayLike<T>, fn: (value: T, i: number) => boolean): T | null {
    valid.func(fn)
    return UnsafeArray.prototype.find.call(valid.obj(array), fn)
  },
  findKey<T>(obj: Record<string, T>, fn: (key: string, value: T, i: number) => boolean): T | null {
    valid.func(fn)
    const key = UnsafeObject.keys(valid.obj(obj)).find((key, i) => fn(key, obj[key], i))
    return key ? obj[key] : null
  },
  getVal(key: string, def?: GMValue): Promise<GMValue | void> {
    return GM.getValue(valid.str(key), def)
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
    return UnsafeObject.prototype.hasOwnProperty.call(valid.obj(obj), valid.str(prop))
  },
  index<T>(array: ArrayLike<T>, fn: (value: T, i: number) => boolean): number {
    valid.func(fn)
    return UnsafeArray.prototype.findIndex.call(valid.obj(array), fn)
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
    valid.func(fn)
    // @ts-ignore
    return UnsafeArray.prototype.map.call(valid.obj(array), fn)
  },
  mapKey<T, R>(obj: Record<string, T>, fn: (key: string, value: T, i: number) => R): R[] {
    valid.func(fn)
    return UnsafeObject.keys(valid.obj(obj)).map((key, i) => fn(key, obj[key], i))
  },
  noop(): void { },
  open(url: string): void {
    GM.openInTab(valid.str(url), false)
  },
  query<E extends HTMLElement>(sel: string, root: ParentNode = document): E | null {
    valid.obj(root)
    return root.querySelector(valid.str(sel))
  },
  queryAll<E extends HTMLElement>(sel: string, root: ParentNode = document): E[] {
    valid.obj(root)
    return Array.from(root.querySelectorAll(valid.str(sel)))
  },
  randInt(max: number): number {
    return UnsafeMath.floor(valid.num(max) * Math.random())
  },
  request: {
    send: sendRequest,
    get(url: string): Promise<CustomResponse> {
      return sendRequest('GET', url)
    },
    post(url: string, data: string): Promise<CustomResponse> {
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
    return GM.setValue(valid.str(key), utils.str(value))
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
})

/** Sends HTTP request. Runs in unsafe window! */
function sendRequest(method: string, url: string, opts: RequestOptions = {}): Promise<CustomResponse> {
  valid.str(method)
  valid.str(url)
  valid.obj(opts)
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
      onabort: (resp) => reject(toCustomResp(resp)),
      onerror: (resp) => reject(toCustomResp(resp)),
      onload: (resp) => resolve(toCustomResp(resp)),
    })
  })
}

/** Converts Greasemonkey response to custom response. */
function toCustomResp(resp: GMResponse): CustomResponse {
  return {
    headers: resp.responseHeaders,
    readyState: resp.readyState,
    status: resp.status,
    statusText: resp.statusText,
    text: resp.responseText,
  }
}
