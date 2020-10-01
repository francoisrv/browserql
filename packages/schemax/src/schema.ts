import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import getExtendedQueries from './lib/getExtendedQueries';
import getQueries, { Options as GetQueriesOptions } from './lib/getQueries';
import getQueryArguments from './lib/getQueryArguments';
import getQueryByName from './lib/getQueryByName';

export default function enhanceSchema(schema: string | DocumentNode) {
  const document = typeof schema === 'string' ? gql(schema) : schema;

  return {
    getExtendedQueries: () => getExtendedQueries(document as DocumentNode),
    getQueries: (options: GetQueriesOptions = {}) =>
      getQueries(document as DocumentNode, options),
    getQueryArguments,
    getQueryByName: (name: string) => getQueryByName(document, name),
  };
}