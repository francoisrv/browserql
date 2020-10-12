// @ts-ignore
import { mockFirebase } from 'firestore-jest-mock'
import './firebaseConfig'
import { render, waitFor, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserqlProvider } from '@browserql/react';
import { gql } from '@apollo/client';
import connectFirestore, { where } from '@browserql/firestore'
import React from 'react';

import { Firestoreql } from './components';

mockFirebase({
  database: {
    users: [
      { id: 'abc123', name: 'Homer Simpson' },
      { id: 'abc456', name: 'Lisa Simpson' },
    ],
    posts: [{ id: '123abc', title: 'Really cool title' }],
  },
});

test('it should work with query', async () => {
  const schema = gql`
    type Test @firestore(collection: "tests") {
      id: ID!
      foo: String!
    }
  `

  const firestore = connectFirestore({ schema })

  render(
    <BrowserqlProvider extensions={[firestore]}>
      <Firestoreql<{ id: string, name: string }[]>
        paginate="Test"
        where={[where('done').equals(false)]}
        size={10}
        orderBy="name"
        renderLoading={<div data-testid="loading">Loading</div>}
        renderError={e => <div>{e.message}</div>}
        render={(tests: { id: string, name: string }[]) => (
          <ul data-testid="tests">
            {tests.map((test) => (
              <li key={test.id}>{test.name}</li>
            ))}
          </ul>
        )}
      />
    </BrowserqlProvider>
  )

  expect(screen.getByTestId('loading')).toContainHTML(
    '<div data-testid="loading">Loading</div>'
  )

  await act(async () => {
    await waitFor(() => screen.getByTestId('tests'))
  })

  expect(screen.getByTestId('tests'))
  .toBeEmptyDOMElement()
});
