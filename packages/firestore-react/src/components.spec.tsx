// @ts-ignore
import { mockFirebase } from 'firestore-jest-mock'
import './firebaseConfig'
import { render, waitFor, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserqlProvider } from '@browserql/react';
import { gql } from '@apollo/client';
import { connectFirestore, where } from '@browserql/firestore'
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

const schema = gql`
  type Test @firestore {
    id: ID!
    foo: String!
  }
`

const firestore = connectFirestore({ schema })

test('it should work with paginate', async () => {
  render(
    <BrowserqlProvider extensions={[firestore]}>
      <Firestoreql<{ id: string, foo: string }[]>
        paginate="Test"
        size={10}
        orderBy="foo"
        renderLoading={<div data-testid="loading">Loading</div>}
        renderError={e => <div>{e.message}</div>}
        render={(tests: { id: string, foo: string }[]) => (
          <ul data-testid="tests">
            {tests.map((test) => (
              <li key={test.id}>{test.foo}</li>
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
  .toContainHTML('<ul data-testid="tests"><li>bar</li><li>barz</li></ul>')
});

test('it should work with get by id', async () => {
  render(
    <BrowserqlProvider extensions={[firestore]}>
      <Firestoreql<{ id: string, foo: string }>
        get="Test"
        id="b7a9kQCqq5QnmgeSTqv7"
        renderLoading={<div data-testid="loading">Loading</div>}
        renderError={e => <div>{e.message}</div>}
        render={(test: { id: string, foo: string }) => <div data-testid="test">{ test.foo }</div>}
      />
    </BrowserqlProvider>
  )

  expect(screen.getByTestId('loading')).toContainHTML(
    '<div data-testid="loading">Loading</div>'
  )

  await act(async () => {
    await waitFor(() => screen.getByTestId('test'))
  })

  expect(screen.getByTestId('test'))
  .toContainHTML('<div data-testid="test">barz</div>')
});
