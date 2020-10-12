import { render, waitFor, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserqlProvider } from '@browserql/react';
import { gql } from '@apollo/client';
import connectFirestore from '@browserql/firestore'
import React from 'react';

import { Firestoreql } from './components';
// @ts-ignore
import { mockFirebase } from 'firestore-jest-mock'

mockFirebase({
  database: {
    users: [
      { id: 'abc123', name: 'Homer Simpson' },
      { id: 'abc456', name: 'Lisa Simpson' },
    ],
    posts: [{ id: '123abc', title: 'Really cool title' }],
  },
});

test('it should work with query', () => {
  const schema = gql`
    type User @firestore(collection: "users") {
      id: ID!
      name: String!
    }
  `

  const firestore = connectFirestore({ schema })

  render(
    <BrowserqlProvider extensions={[firestore]}>
      <Firestoreql
        get=
      />
    </BrowserqlProvider>
  )
});
