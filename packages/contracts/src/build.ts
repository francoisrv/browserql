import schemax from '@browserql/schemax';
import fragmentsx from '@browserql/fragments';
import { DocumentNode } from 'graphql';

export function build(schema: string | DocumentNode) {
  const queries = schemax(schema).getQueries();
  for (const query of queries) {
    const fragments = fragmentsx.buildQueryFragment(query);
  }
}
