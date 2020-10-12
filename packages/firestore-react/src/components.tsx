import { BrowserqlContext, BrowserqlQuery } from '@browserql/react';
import React, { ReactNode } from 'react';
import makeContracts from '@browserql/contracts'
import { Query } from '@browserql/firestore';

interface Props<A = any> {
  get: string
  where?: Query[]
  id?: string
  size?: number
  page?: number
  render: (a: A) => ReactNode
}

export function Firestoreql<A = any>(props: Props<A>) {
  const ctx = React.useContext(BrowserqlContext)
  const contracts = makeContracts(ctx.schema as string)
  const variables = {
    collection: props.get,
    where: props.where,
  }

  return (
    <BrowserqlQuery
      query={contracts.Query.firestorePaginate}
      variables={variables}
      renderLoading="Loading"
      renderError={ e => <div>{e.message}</div>}
      render={props.render}
    />
  )
}
