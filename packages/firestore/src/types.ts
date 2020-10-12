export enum QueryOperator {
  equals = '=='
}

export interface Query {
  field: string
  value: any
  operator: QueryOperator
}
