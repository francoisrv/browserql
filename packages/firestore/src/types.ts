export enum QueryOperator {
  equals = 'equals',
  references = 'references',
  isIn = 'isIn',
  greaterThan = 'greaterThan',
  greaterThanOrEqualTo = 'greaterThanOrEqualTo',
  lesserThan = 'lesserThan',
  lesserThanOrEqualTo = 'lesserThanOrEqualTo',
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
  asc?: boolean
  populate?: string | string[]
}

export interface Transformer {
  field: string
  value?: any
}
