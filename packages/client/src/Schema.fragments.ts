import Schema from "./Schema";
import { DocumentNode, FragmentDefinitionNode } from "graphql";
import { find } from "lodash";

export default class SchemaFragments {
  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}

  getFragments(): FragmentDefinitionNode[] {
    const { definitions } = this.document
    return definitions.filter(f => f.kind === 'FragmentDefinition') as FragmentDefinitionNode[]
  }

  getFragment(name: string): FragmentDefinitionNode | undefined {
    return find(this.getFragments(), e => Schema.getName(e) === name)
  }
}