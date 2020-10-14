import { gql } from '@apollo/client';
import connect from '@browserql/client';
import React from 'react';
import makeContracts from '@browserql/contracts'
import { render, waitFor, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { keys } from 'lodash';

import { BrowserqlContext, BrowserqlMutation, BrowserqlProvider, BrowserqlQuery } from '.';

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
      <BrowserqlQuery<{ name: string }[]>
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

test('it should have context', () => {
  function Foo() {
    const ctx = React.useContext(BrowserqlContext)
  
    return <div data-testid="foo">{ keys(ctx).join(', ') }</div>
  }
  
  render(
    <BrowserqlProvider client={client}>
      <Foo />
    </BrowserqlProvider>
  )

  expect(screen.getByTestId('foo'))
  .toContainHTML('<div data-testid="foo">apollo, client, cache, schema, directives, mutations, queries, scalars, context</div>')
})

test('it should fix bug 44', () => {
  render(
    <BrowserqlProvider extensions={[{ schema: 'extend type Query { todo: Todo } type Todo { id: ID }'}]}>
      <div />
    </BrowserqlProvider>
  )
})

test('it should use BrowserqlMutation', async () => {
  function Foo() {
    return (
      <BrowserqlMutation<{ name: string }>
        mutation={gql`
          mutation addTodo($name: String!) {
            addTodo(name: $name) {
              name
            }
          }
        `}
        render={(addTodo, { loading, data, called }) => (
          <button
            data-testid="foo"
            disabled={loading}
            onClick={() => addTodo({ name: 'foo' })}
            tabIndex={called}
          >
            {JSON.stringify(data) || 'null'}
          </button>
        )}
        renderLoading={<div data-testid="loading">Loading</div>}
        renderError="Error"
      />
    )
  }

  render(
    <BrowserqlProvider
      schema={gql`
        type Todo { name: String }
        extend type Mutation {
          addTodo(name: String!): Todo!
        }
      `}
      mutations={{
        async addTodo({ name }: { name: string }) {
          return { name }
        }
      }}
    >
      <Foo />
    </BrowserqlProvider>
  )

  expect(await screen.findByTestId('foo')).toHaveTextContent('null')

  expect(await screen.findByTestId('foo')).toHaveAttribute('tabindex', '0')

  await act(async () => {
    fireEvent.click(await screen.findByTestId('foo'))
  })

  expect(await screen.findByTestId('foo')).toHaveTextContent('{"addTodo":{"name":"foo","__typename":"Todo"}}')

  expect(await screen.findByTestId('foo')).toHaveAttribute('tabindex', '1')

});
