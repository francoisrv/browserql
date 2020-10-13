export enum QueryOperator {
  equals = "equals",
  references = "references",
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
  populate?: string | string[]
}
