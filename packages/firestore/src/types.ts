export enum FirestoreqlType {
  getter = 'getter',
}

export enum FirestoreqlGetter {
  asc = 'asc',
}

export type FirestoreqlModifier = {
  type: FirestoreqlType.getter
} & (
  | {
      name: FirestoreqlGetter.asc
      value: boolean
    }
  | {
      name: 'first' | 'last'
    }
  | {
      name: 'increment' | 'multiply' | 'limit'
      value: number
    }
)

export enum QueryOperator {
  equals = 'equals',
  references = 'references',
  isIn = 'isIn',
  isGreaterThan = 'isGreaterThan',
  isGreaterThanOrEqualTo = 'isGreaterThanOrEqualTo',
  isLesserThan = 'isLesserThan',
  isLesserThanOrEqualTo = 'isLesserThanOrEqualTo',
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

export interface QueryWhere {
  field: string
  operator: QueryOperator
  value: any
}
