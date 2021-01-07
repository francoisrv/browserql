import React, { useContext } from 'react'
import { get } from '@browserql/firestore'
import { BrowserqlContext, UseQuery } from '@browserql/react'
import { DocumentNode } from '@apollo/client'

export interface FirestorqlGetProps {
  get: string
}

export type FirestorqlProps = FirestorqlGetProps

export function Firestoreql(props: FirestorqlProps) {
  const ctx = useContext(BrowserqlContext)
  const query = get(ctx.schema as DocumentNode, 'Todo')
  return <UseQuery query={query}>{(a) => <p>OK</p>}</UseQuery>
}
