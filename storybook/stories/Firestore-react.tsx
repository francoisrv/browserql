import React from 'react'
import { useState } from 'react'
import { Firestoreql } from '../../packages/firestore-react'

function ExampleCodeAdd() {
  const [name, setName] = useState('')

  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <Firestoreql
        addOne="Todo"
        renderError={({ error }) => <div>{error.message}</div>}
      >
        {(addTodo, { loading }) => (
          <button disabled={loading} onClick={() => addTodo({ name })}>
            Add todo
          </button>
        )}
      </Firestoreql>
    </>
  )
}

export function ExampleCode() {
  return (
    <Firestoreql paginate="Todo">
      {(todos) => (
        <>
          <h1>{todos.length} todo(s)</h1>
          <ExampleCodeAdd />
        </>
      )}
    </Firestoreql>
  )
}
