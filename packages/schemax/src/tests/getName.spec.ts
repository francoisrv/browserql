import getName from '../lib/getName';

import gql from 'graphql-tag';
import { ObjectTypeDefinitionNode } from 'graphql';

test('it should work with a type', () => {
  const [Foo] = gql`
    type Foo {
      id: String
    }
  `.definitions;
  const name = getName(Foo);
  expect(name).toEqual('Foo');
});

test('it should work with a field', () => {
  const [Foo] = gql`
    type Foo {
      id: String
    }
  `.definitions;
  const [id] = (Foo as ObjectTypeDefinitionNode).fields || [];
  const name = getName(id);
  expect(name).toEqual('id');
});

test('it should work with an argument', () => {
  const [Foo] = gql`
    type Foo {
      id(bar: String): String
    }
  `.definitions;
  const [id] = (Foo as ObjectTypeDefinitionNode).fields || [];
  const [bar] = id.arguments || [];
  const name = getName(bar);
  expect(name).toEqual('bar');
});
