import gql from "graphql-tag"

test('it should get diretive value', () => {
  const schema = gql`
  type Foo {
    bold: @bold
  }
  `
})
