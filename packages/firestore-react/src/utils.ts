export enum QueryOperator {
  equals = '=='
}

export interface Query {
  field: string
  value: any
  operator: QueryOperator
}

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