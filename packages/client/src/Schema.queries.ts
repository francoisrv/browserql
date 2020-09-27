import Schema from './Schema';
import { DocumentNode, FieldDefinitionNode } from 'graphql';
import { find } from 'lodash';
import gql from 'graphql-tag';
import SchemaDirectives from './Schema.directives';

export interface QueryTypedSignature {
  variables: any;
  data: any;
}

export interface QueryTyped {
  [query: string]: QueryTypedSignature;
}

export default class SchemaQueries {
  constructor(
    private readonly schema: Schema,
    private readonly document: DocumentNode
  ) {}

  getQueryType() {
    const { definitions } = this.document;
    return find(
      definitions,
      (def) =>
        def.kind === 'ObjectTypeDefinition' && Schema.getName(def) === 'Query'
    );
  }

  getExtendedQueryTypes() {
    const { definitions } = this.document;
    return definitions.filter(
      (def) =>
        def.kind === 'ObjectTypeExtension' && Schema.getName(def) === 'Query'
    );
  }

  getTypedQueries(): QueryTyped {
    const queries = this.getQueries();
    const typeQueries: QueryTyped = {};
    for (const query of queries) {
      const name = Schema.getName(query);
      typeQueries[name] = {
        variables: {},
        data: {},
      };
    }
    return typeQueries;
  }

  getQueries(): FieldDefinitionNode[] {
    const queries: FieldDefinitionNode[] = [];
    const queryType = this.getQueryType();
    if (queryType) {
      // @ts-ignore
      queries.push(...queryType.fields);
    }
    const extendedQueries = this.getExtendedQueryTypes();
    extendedQueries.forEach((q) => {
      // @ts-ignore
      queries.push(...q.fields);
    });
    return queries;
  }

  getQuery(name: string): FieldDefinitionNode | undefined {
    const queries = this.getQueries();
    return find(queries, (query) => Schema.getName(query) === name);
  }

  getQueriesWithDirective(directive: string) {
    const queries = this.getQueries();
    return queries.filter((query) =>
      SchemaDirectives.hasDirective(query, directive)
    );
  }

  addQuery(query: string | DocumentNode) {
    const document = typeof query === 'string' ? gql(query) : query;
    if (this.getQueryType()) {
      // @ts-ignore definitions are read-only
      document.definitions[0].kind = 'ObjectTypeExtension';
    } else {
      // @ts-ignore definitions are read-only
      document.definitions[0].kind = 'ObjectTypeDefinition';
    }
    // @ts-ignore
    this.document.definitions.push(document.definitions[0]);
  }

  addQueryFields(source: string | DocumentNode) {
    const document = typeof source === 'string' ? gql(source) : source;
    const extendedType = Schema.getName(document.definitions[0]);
    if (!extendedType) {
      throw new Error(`Can not extend undeclared type ${extendedType}`);
    }
    const type = this.getQueryType();
    if (!type) {
      throw new Error(`Can not extend undeclared type ${extendedType}`);
    }
    // @ts-ignore
    type.fields.push(...document.definitions[0].fields);
  }
}
