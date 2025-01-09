import { PathParams as Params } from 'msw'
import { isArray } from '../../libs/utils/guards'
import { rebuild, toInteger } from '../../libs/utils/helpers'
import { Nullable } from '../../libs/utils/typings'
import { exceptions } from './constants'
import { ParamsValue, PathParams, PathParamsKey, QueryParams, QueryParamsKey } from './typings'

const getSingleQueryParam = (map: URL, key: QueryParamsKey): ParamsValue => {
  return map.searchParams.get(key)
}

const getQueryParams = (url: string): Record<QueryParamsKey, ParamsValue> => {
  const map = new URL(url)
  return {
    id: getSingleQueryParam(map, 'id'),
  }
}

export const parseQueryParams = (url: string): Partial<QueryParams> => {
  const { id } = getQueryParams(url)
  const result: Nullable<QueryParams> = {
    id: toInteger(id),
  }
  return rebuild(result, exceptions) as Partial<QueryParams>
}

export const parsePathParams = (params: Params<PathParamsKey>): Partial<PathParams> => {
  const result: Nullable<PathParams> = {
    id: isArray(params.id) ? null : toInteger(params.id ?? null),
  }
  return rebuild(result, exceptions) as Partial<PathParams>
}
