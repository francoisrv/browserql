import { camelCase } from 'lodash'
import { Query, QueryOperator } from './types'

export function where(field: string) {
  return {
    equals(value: any): Query {
      return {
        field,
        value,
        operator: QueryOperator.equals,
      }
    }
  }
}

export function plural(name: string) {
  return /y$/.test(name) ? name.replace(/y$/, 'ies') : ''.concat(name).concat('s')
}

export function convertName(name: string) {
  return plural(camelCase(name)).toLowerCase()
}
