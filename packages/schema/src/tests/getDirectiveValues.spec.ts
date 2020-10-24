import { ObjectTypeDefinitionNode, getDirectiveValues, buildSchema, print, FieldDefinitionNode, DirectiveDefinitionNode, DirectiveNode } from 'graphql'
import gql from "graphql-tag"
import { getName } from '..'
import getDirective from '../lib/getDirective'
import getDirectives from '../lib/getDirectives'
import getField from '../lib/getField'
import getType from '../lib/getType'
import parseDirective from '../lib/parseDirective'

test('it should get directive value', () => {
  const schema = gql`
    directive @bold on FIELD_DEFINITION
    directive @collage(
      id: ID
      text: String
      foo: Foo
    ) on FIELD_DEFINITION
    type Foo {
      foo: Int
      @bold
      @collage(
        id: 1234
        text: "hello"
        foo: {
          foo: 456
        }
      )
    }
  `
  const Foo = getType(schema, 'Foo')
  const foo = getField(Foo as ObjectTypeDefinitionNode, 'foo')
  const boldDef = getDirective(schema, 'bold')
  const collageDef = getDirective(schema, 'collage')
  const bold = getDirective(foo as FieldDefinitionNode, 'bold')
  const collage = getDirective(foo as FieldDefinitionNode, 'collage')
  console.log(parseDirective(
    boldDef as DirectiveDefinitionNode,
    bold as DirectiveNode
  ))
  console.log(parseDirective(
    collageDef as DirectiveDefinitionNode,
    collage as DirectiveNode
  ))
})
