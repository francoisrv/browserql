import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import getByName from './lib/getByName';

import getExtendedQueries from './lib/getExtendedQueries';
import getMutation from './lib/getMutation';
import getMutations, {
  Options as GetMutationsOptions,
} from './lib/getMutations';
import getQueries, { Options as GetQueriesOptions } from './lib/getQueries';
import getQueryArguments from './lib/getQueryArguments';
import getQueryByName from './lib/getQueryByName';
import getType from './lib/getType';
import getTypes from './lib/getTypes';

export default function enhanceSchema(schema: string | DocumentNode) {
  const document = typeof schema === 'string' ? gql(schema) : schema;

  return {
    getExtendedQueries: () => getExtendedQueries(document as DocumentNode),
    getQueries: (options: GetQueriesOptions = {}) =>
      getQueries(document as DocumentNode, options),
    getArguments: getQueryArguments,
    getQuery: (name: string) => getQueryByName(document, name),
    getTypes: () => getTypes(document),
    getByName: (name: string) => getByName(document, name),
    getType: (name: string) => getType(document, name),
    getMutations: (options: GetMutationsOptions = {}) =>
      getMutations(document as DocumentNode, options),
    getMutation: (name: string) => getMutation(document, name),
  };
}
