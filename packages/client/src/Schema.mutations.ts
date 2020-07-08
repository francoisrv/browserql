import Schema from "./Schema";
import { DocumentNode, FieldDefinitionNode } from "graphql";
import { find } from "lodash";
import gql from 'graphql-tag'

export default class SchemaMutations {
  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}

  getMutationType() {
    const { definitions } = this.document
    return find(
      definitions,
      def => def.kind === 'ObjectTypeDefinition' && Schema.getName(def) === 'Mutation'
    )
  }

  getMutations(): FieldDefinitionNode[] {
    const mutations: FieldDefinitionNode[] = []
    const mutationType = this.getMutationType()
    if (mutationType) {
      // @ts-ignore
      mutations.push(...mutationType.fields)
    }
    const extendedMutations = this.schema.queries.getExtendedQueryTypes()
    extendedMutations.forEach(q => {
      // @ts-ignore
      mutations.push(...q.fields)
    })
    return mutations
  }

  addMutation(mutation: string | DocumentNode) {
    const document = typeof mutation === 'string' ? gql(mutation) : mutation
    if (this.getMutationType()) {
      // @ts-ignore definitions are read-only
      document.definitions[0].kind = 'ObjectTypeExtension'
    } else {
      // @ts-ignore definitions are read-only
      document.definitions[0].kind = 'ObjectTypeDefinition'
    }
    // @ts-ignore
    this.document.definitions.push(document.definitions[0])
  }
}