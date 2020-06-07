export interface DB {
  [model: string]: Model<any>
}

export interface Paging {
  page: number
}

export interface FindOptions {
  paging?: Paging
}

export interface Model<T> {
  find(where: any, options: FindOptions): T[]
}
