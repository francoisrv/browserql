import React, { ReactElement, useContext } from 'react'
import { get } from '@browserql/firestore'
import { BrowserqlContext, UseQuery } from '@browserql/react'
import { DocumentNode } from '@apollo/client'

interface FirestorqlGetProps {
  get: string
}

type Renderer = (data: any) => ReactElement

export type FirestorqlProps = FirestorqlGetProps & {
  children: Renderer
}

export function Firestoreql(props: FirestorqlProps) {
  const ctx = useContext(BrowserqlContext)
  const query = get(ctx.schema as DocumentNode, 'Todo')
  return (
    <UseQuery query={query}>
      {(a) => {
        console.log({ a })
        return props.children(a.firestore_getMany_Todo)
      }}
    </UseQuery>
  )
}
