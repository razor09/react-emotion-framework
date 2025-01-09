export type StringOrNumber = string | number

export type StringOrBoolean = string | boolean

export type StringOrNumberOrBoolean = StringOrNumber | boolean

export type UndefinedOrNull = undefined | null

export type Primitive = StringOrNumberOrBoolean | UndefinedOrNull

export type Collection = Record<string, string>

export type Storage<T extends object = object> = T & { [Symbol.iterator]?: never }

export type List = Array<unknown> | ReadonlyArray<unknown>

export type MaybeNull<T> = T | null

export type MaybeUndefined<T> = T | undefined

export type MaybeNotExist<T> = T | UndefinedOrNull

export type Path<T extends string = string> = [T, ...StringOrNumber[]]

export type Key<T extends object = object> = keyof T

export type Keys<T extends object = object> = ReadonlyArray<Key<T>>

export type Nullable<T> = { [P in keyof T]: MaybeNull<T[P]> }
