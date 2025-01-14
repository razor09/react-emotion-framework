import { isArray } from '../utils/guards'
import { mergePathWithParams, rebuild, toInteger } from '../utils/helpers'
import { MaybeUndefined } from '../utils/typings'
import {
  Endpoint,
  ErrorCallback,
  HttpBaseConfig,
  HttpCallConfig,
  LoadFileConfig,
  LoadStreamConfig,
  QueryParams,
  RequestMethod,
  Stream,
} from './typings'

export class HttpClient {
  private readonly baseUrl: MaybeUndefined<string>
  private readonly headers: MaybeUndefined<HeadersInit>
  private readonly credentials: MaybeUndefined<RequestCredentials>

  private readonly exceptions = ['', NaN, null, undefined]

  private errorCallback: MaybeUndefined<ErrorCallback>

  constructor(config?: Partial<HttpBaseConfig>) {
    if (config) {
      const { baseUrl, headers, credentials } = config
      this.baseUrl = baseUrl
      this.headers = headers
      this.credentials = credentials
    }
  }

  private generateUrl(endpoint: Endpoint, queryParams?: QueryParams): string {
    const baseUrl = this.baseUrl ?? ''
    const fullPath = isArray(endpoint) ? mergePathWithParams(endpoint) : endpoint
    if (queryParams) {
      const result = rebuild(queryParams, this.exceptions)
      const queryString = Object.entries(result)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
      return `${baseUrl}/${fullPath}?${queryString}`
    } else {
      return `${baseUrl}/${fullPath}`
    }
  }

  private async *pumpStream(total: number, reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<Stream> {
    let loaded = 0
    while (loaded < total) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        loaded += value.length
        yield {
          value,
          loaded,
          total,
          progress: Math.round((loaded / total) * 100),
        }
      }
    }
  }

  private async fetch<B extends object>(url: string, method: RequestMethod, body?: B): Promise<Response> {
    return await fetch(url, {
      method,
      headers: this.headers,
      credentials: this.credentials,
      body: JSON.stringify(body),
    })
  }

  private async call<R, Q extends QueryParams, B extends object>(config: HttpCallConfig<Q, B>): Promise<R> {
    try {
      const { endpoint, queryParams, method, body } = config
      const url = this.generateUrl(endpoint, queryParams)
      const response = await this.fetch(url, method, body)
      return response.json()
    } catch (error) {
      throw error
    }
  }

  public async get<R, Q extends QueryParams = QueryParams>(endpoint: Endpoint, queryParams?: Q): Promise<R> {
    try {
      return await this.call({
        method: 'get',
        endpoint,
        queryParams,
      })
    } catch (error) {
      if (this.errorCallback) this.errorCallback(error)
      throw error
    }
  }

  public async post<R, B extends object = object>(endpoint: Endpoint, body?: B): Promise<R> {
    try {
      return await this.call({
        method: 'post',
        endpoint,
        body,
      })
    } catch (error) {
      if (this.errorCallback) this.errorCallback(error)
      throw error
    }
  }

  public async put<R, B extends object = object>(endpoint: Endpoint, body?: B): Promise<R> {
    try {
      return await this.call({
        method: 'put',
        endpoint,
        body,
      })
    } catch (error) {
      if (this.errorCallback) this.errorCallback(error)
      throw error
    }
  }

  public async delete<R, B extends object = object>(endpoint: Endpoint, body?: B): Promise<R> {
    try {
      return await this.call({
        method: 'delete',
        endpoint,
        body,
      })
    } catch (error) {
      if (this.errorCallback) this.errorCallback(error)
      throw error
    }
  }

  public async loadFile<Q extends QueryParams = QueryParams>(config: LoadFileConfig<Q>): Promise<ArrayBuffer> {
    try {
      const { endpoint, queryParams } = config
      const url = this.generateUrl(endpoint, queryParams)
      const response = await this.fetch(url, 'get')
      return response.arrayBuffer()
    } catch (error) {
      if (this.errorCallback) this.errorCallback(error)
      throw error
    }
  }

  public async loadStream<Q extends QueryParams = QueryParams>(config: LoadStreamConfig<Q>): Promise<Uint8Array[]> {
    try {
      const { endpoint, queryParams, onReadStream } = config
      const url = this.generateUrl(endpoint, queryParams)
      const response = await this.fetch(url, 'get')
      const chunks = new Array<Uint8Array>()
      if (response.body) {
        const total = toInteger(response.headers.get('content-length'))
        if (total) {
          const reader = response.body.getReader()
          for await (const stream of this.pumpStream(total, reader)) {
            chunks.push(stream.value)
            if (onReadStream) onReadStream(stream)
          }
        }
      }
      return chunks
    } catch (error) {
      if (this.errorCallback) this.errorCallback(error)
      throw error
    }
  }

  public onError<E = unknown>(errorCallback: ErrorCallback<E>): void {
    this.errorCallback = errorCallback as ErrorCallback
  }
}
