export interface DB {
  [model: string]: Model<any>
}

export interface Paging {
  page: number
}

export interface Filters {
  paging?: Paging
}

export interface Where {
  [field: string]: any
}

export interface Input {
  where?: Where
  id?: string
}

export interface Model<T> {
  find(where: Where, filters: Filters): T[]
}
