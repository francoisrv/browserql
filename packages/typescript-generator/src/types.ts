export interface TSGeneratorOptions {
  useExport?: boolean
  useDeclare?: boolean
  typeSuffix?: string
  null?: NULL_STRATEGY | NULL_STRATEGY[]
  ID?: string
}

export enum NULL_STRATEGY {
  null = 'null',
  undefined = 'undefined',
  missing = 'missing',
}
