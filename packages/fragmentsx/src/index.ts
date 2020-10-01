import { DocumentNode, isType } from "graphql";
import gql from "graphql-tag";
import enhanceSchema, { getKind } from "@browserql/schemax";

export default function buildFragments(document: string | DocumentNode) {
  const schema = enhanceSchema(document);
  const queries = schema.getQueries();
  const fragments = {};
  queries.forEach((query) => {
    const queryKind = getKind(query);
    if (isType(queryKind)) {
    }
  });
}
