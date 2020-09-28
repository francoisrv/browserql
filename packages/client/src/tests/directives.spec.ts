import gql from 'graphql-tag';

import { GraphQLEnumValue, GraphQLField } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

import connect from '../connect';

class DeprecatedDirective extends SchemaDirectiveVisitor {
  public constructor(config: any) {
    super(config);
  }

  public visitFieldDefinition(field: GraphQLField<any, any>) {
    // console.log({ field });
    field.isDeprecated = true;
    field.deprecationReason = this.args.reason;
  }

  public visitEnumValue(value: GraphQLEnumValue) {
    // console.log({ value });
    value.isDeprecated = true;
    value.deprecationReason = this.args.reason;
  }
}

const schema = gql`
  directive @deprecated(
    reason: String = "No longer supported"
  ) on FIELD_DEFINITION | ENUM_VALUE

  enum List {
    foo
    bar @deprecated(reason: "Use foo")
  }

  type Object {
    json: String @deprecated(reason: "Use newField.")
    tag: List
  }

  type Query {
    getObject: Object
  }
`;

const { apollo: client } = connect({
  schema,
  directives: {
    deprecated: DeprecatedDirective,
  },
  queries: {
    getObject() {
      return { json: 'hello' };
    },
  },
});

test('it should get query', async () => {
  const { data } = await client.query({
    query: gql`
      query {
        getObject {
          json
        }
      }
    `,
  });
  expect(data.getObject).toEqual({
    __typename: 'Object',
    json: 'hello',
  });
});
