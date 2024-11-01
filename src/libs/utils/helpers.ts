import { Indentation, PropertyOrList } from './typings'

export const stringify = (value: PropertyOrList, space?: Indentation): string => {
  return JSON.stringify(value, space && null, space)
}
