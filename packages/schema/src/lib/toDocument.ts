import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export default function toDocument(doc: string | DocumentNode): DocumentNode {
  if (typeof doc === 'string') {
    return gql(doc)
  }
  return doc
}