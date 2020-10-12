export enum QueryOperator {
  equals = '=='
}

export interface Query {
  field: string
  value: any
  operator: QueryOperator
}

export interface QueryFilters {
  page?: number
  size?: number
  orderBy?: string
}
