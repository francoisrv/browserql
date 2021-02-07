export interface Definition {
  id: number
  name: string
  kind: DefinitionKind
}

export enum DefinitionKind {
  type = 'type',
  input = 'input',
}
