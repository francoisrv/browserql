import { gql } from '@apollo/client';
import connect from '@browserql/client';
import React from 'react';
import makeContracts from '@browserql/contracts'
import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { keys } from 'lodash';

import { BrowserqlContext, BrowserqlProvider, GraphQLQuery } from '.';

const schema = gql`
type Todo {
  name: String!
}

extend type Query {
  getTodos(empty: Boolean!): [Todo!]!
}
`

const queries = {
  async getTodos(vars: { empty: boolean }) {
    return vars.empty ? [] : [{ name: 'Buy milk' }]
  }
}

const client = connect({ schema, queries })

const contracts = makeContracts(client.schema)


test('it should execute a query', async () => {
  render(
    <BrowserqlProvider client={client}>
      <GraphQLQuery<{ name: string }[]>
        query={contracts.Query.getTodos}
        variables={{ empty: false }}
        renderLoading={<div data-testid="loading">Loading</div>}
        render={todos => (
          <ul data-testid="todos">
            { todos.map(todo => <li key={todo.name}>{todo.name}</li>) }
          </ul>
        )}
      />
    </BrowserqlProvider>
  )
  expect(screen.getByTestId('loading'))
  .toHaveTextContent('Loading')

  await waitFor(() => screen.getByTestId('todos'))

  expect(screen.getByTestId('todos'))
  .toContainHTML('<li>Buy milk</li>')
})

function Foo() {
  const ctx = React.useContext(BrowserqlContext)

  return <div data-testid="foo">{ keys(ctx).join(', ') }</div>
}

test('it should have context', () => {
  render(
    <BrowserqlProvider client={client}>
      <Foo />
    </BrowserqlProvider>
  )

  expect(screen.getByTestId('foo'))
  .toContainHTML('<div data-testid="foo">apollo, client, cache, schema, directives, mutations, queries, scalars</div>')
})

test('it should fix bug 44', () => {
  render(
    <BrowserqlProvider extensions={[{ schema: 'extend type Query { todo: Todo } type Todo { id: ID }'}]}>
      <div />
    </BrowserqlProvider>
  )
})
