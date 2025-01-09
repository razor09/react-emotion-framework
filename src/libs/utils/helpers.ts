import {
  isArray,
  isBoolean,
  isBooleanPattern,
  isNumber,
  isNumberPattern,
  isObject,
  isPrimitive,
  isString,
} from './guards'
import { Collection, MaybeNull, Path, Primitive, Storage, StringOrBoolean, StringOrNumber } from './typings'

export const mergePathWithParams = (path: Path): string => {
  const [resource, ...params] = path
  const parts = resource.split('/')
  let index = 0
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith(':') && params[index]) {
      parts[i] = params[index].toString()
      index++
    }
  }
  return parts.join('/')
}

export const toInteger = (value: MaybeNull<StringOrBoolean>): MaybeNull<number> => {
  if (isString(value) && isNumberPattern(value)) return Math.round(value as never)
  else if (isBoolean(value)) return Number(value)
  else return null
}

export const toBoolean = (value: MaybeNull<StringOrNumber>): MaybeNull<boolean> => {
  if (isString(value) && isBooleanPattern(value)) return JSON.parse(value)
  else if (isNumber(value)) return Boolean(value)
  else return null
}

export const isEqual = (left: unknown, right: unknown): boolean => {
  if (isPrimitive(left) && isPrimitive(right)) {
    return left === right
  }
  if (isObject<Collection>(left) && isObject<Collection>(right)) {
    const leftKeys = Object.keys(left)
    const rightKeys = Object.keys(right)
    return isEqual(leftKeys, rightKeys) && leftKeys.every((key) => isEqual(left[key], right[key]))
  }
  if (isArray(left) && isArray(right)) {
    return isEqual(left.length, right.length) && left.every((value) => right.some((other) => isEqual(value, other)))
  }
  return false
}

export const rebuild = <T extends Storage>(storage: T, exceptions?: Primitive[]): T => {
  return Object.entries(storage).reduce((result, [key, value]) => {
    if (isPrimitive(value)) {
      return exceptions?.includes(value) ? { ...result } : { ...result, [key]: value }
    }
    if (isObject(value)) {
      return { ...result, [key]: rebuild(value, exceptions) }
    }
    if (isArray(value)) {
      return { ...result, [key]: value.map((item) => (isObject(item) ? rebuild(item, exceptions) : item)) }
    }
    return { ...result }
  }, {} as T)
}
