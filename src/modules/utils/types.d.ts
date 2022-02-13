/*!
 * Util types.
 */

import type { GMResponseType } from '../gm/types'

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
