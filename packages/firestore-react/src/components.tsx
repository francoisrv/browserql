import { BrowserqlContext, BrowserqlMutation, BrowserqlQuery } from '@browserql/react';
import React, { ReactNode } from 'react';
import makeContracts from '@browserql/contracts'
import { Query } from '@browserql/firestore';

type Action =
| { paginate: string }
| { getOne: string }
| { add: string }
| { delete: string }
| { update: string }
| { updateOne: string }

interface Option {
  where?: Query[]
  id?: string
  size?: number
  page?: number
}

type Renders<A = any> = {
  render(a: A): ReactNode
  renderLoading?: ReactNode
  renderError?: ReactNode | ((e: Error) => ReactNode)
}

type Props<A = any> = Action & Option & Renders<A>

function makeVariables<A = any>(props: Props<A>) {
  let collection

  if ('paginate' in props) {
    collection = props.paginate
  } else if ('getOne' in props) {
    collection = props.getOne
  } else if ('add' in props) {
    collection = props.add
  } else if ('delete' in props) {
    collection = props.delete
  } else if ('update' in props) {
    collection = props.update
  } else if ('updateOne' in props) {
    collection = props.updateOne
  }

  return {
    collection
  }
}

export function Firestoreql<A = any>(props: Props<A>) {
  const ctx = React.useContext(BrowserqlContext)
  const contracts = makeContracts(ctx.schema as string)
  const variables = makeVariables<A>(props)

  if ('paginate' in props || 'getOne' in props) {
    return (
      <BrowserqlQuery
        query={contracts.Query[`firestore_findMany_${variables.collection}`]}
        variables={variables}
        renderLoading={props.renderLoading}
        renderError={props.renderError}
        render={props.render}
      />
    )
  }

  return (
    <BrowserqlMutation
      mutation={contracts.Query.OK}
      renderLoading={props.renderLoading}
      renderError={props.renderError}
      render={props.render}
    />
  )
}
