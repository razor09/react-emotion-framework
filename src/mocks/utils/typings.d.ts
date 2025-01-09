import { DelayMode } from 'msw'
import { Error } from '../../libs/fallback/typings'
import { ResponseStatus } from '../../libs/http-client/typings'
import { Key, MaybeNull } from '../../libs/utils/typings'

export declare const status = ResponseStatus.BadRequest

export declare const message = 'default'

export type MaybeError<T> = T | Error

export type DurationOrMode = DelayMode | number

export type PathParamsKey = Key<PathParams>

export type QueryParamsKey = Key<QueryParams>

export type ParamsValue = MaybeNull<string>

export interface PathParams {
  id: number
}

export interface QueryParams {
  id: number
}

export const enum Count {
  Minimal = 1,
}
