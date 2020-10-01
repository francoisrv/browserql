import { DocumentNode, FieldDefinitionNode } from 'graphql';
import enhanceSchema, { getKind, getName, parseKind } from '@browserql/schemax';
import { Dictionary } from 'lodash';
import makeFragments from '@browserql/fragmentsx';
import gql from 'graphql-tag';

export default function makeContracts(document: string | DocumentNode) {
  const schema = enhanceSchema(document);
  const fragments = makeFragments(document);
  const queries = schema.getQueries();
  const mutations = schema.getMutations();
  const Query: Dictionary<DocumentNode> = {};
  const Mutation: Dictionary<DocumentNode> = {};

  const make = (
    operation: 'query' | 'mutation',
    field: FieldDefinitionNode
  ) => {
    const name = getName(field);
    const args = schema.getArguments(field);
    const { type } = parseKind(getKind(field));
    const parts: string[] = [];

    const headers: string[] = [operation];
    if (args.length) {
      headers.push(
        operation === 'query' ? `${name}Query(\n` : `${name}Mutation(\n`
      );
      headers.push(
        args.map((arg) => ` $${getName(arg)}: ${getKind(arg)}`).join('\n ')
      );
      headers.push('\n)');
    }
    headers.push('{');
    parts.push(headers.join(' '));

    const subHeaders: string[] = [' ', name];
    if (args.length) {
      subHeaders.push('(\n   ');
      subHeaders.push(
        args.map((arg) => `${getName(arg)}: $${getName(arg)}`).join('\n    ')
      );
      subHeaders.push('\n   ) {');
    } else {
      subHeaders.push('{');
    }
    parts.push(subHeaders.join(' '));

    parts.push(`     ...${type}Fragment`);

    parts.push('  }');

    parts.push('}');

    parts.push(fragments.get(type) || '');

    const results = gql(parts.join('\n')) as DocumentNode;

    if (operation === 'query') {
      Query[name] = results;
    } else {
      Mutation[name] = results;
    }
  };

  queries.forEach((query) => {
    make('query', query);
  });

  mutations.forEach((mutation) => {
    make('mutation', mutation);
  });

  return {
    Query,
    Mutation,
  };
}
