import { gql } from '@apollo/client';
import connect from '@browserql/client';
import React from 'react';
// import render from '../../react-test/dist'
import makeContracts from '@browserql/contracts'
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { BrowserqlProvider, GraphQLQuery } from '.';

const schema = gql`
type Todo {
  name: String!
}

type Query {
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

const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

test('it should execute a query', async () => {
  render(
    <BrowserqlProvider client={client}>
      <GraphQLQuery
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
