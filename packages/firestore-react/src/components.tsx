import { BrowserqlContext, BrowserqlMutation, BrowserqlQuery } from '@browserql/react';
import React, { ReactNode } from 'react';
import makeContracts from '@browserql/contracts'
import { Query } from '@browserql/firestore';

type QueryAction =
| { paginate: string }
| { get: string }

type MutationAction =
| { add: string }
| { delete: string }
| { update: string }
| { updateOne: string }

interface Option {
  where?: Query[]
  id?: string
  size?: number
  page?: number
  orderBy?: string
}

type Renders = {
  renderLoading?: ReactNode
  renderError?: ReactNode | ((e: Error) => ReactNode)
}

interface Extra {
  loading: boolean
  error?: Error
}

type PropsQuery<A = any> =
& QueryAction
& Option
& Renders
& {
  render: (data: A, extra: Extra) => ReactNode
}

type PropsMutation<A = any> =
& MutationAction
& Renders
& {
  render: (action: any, extra: Extra) => ReactNode
}

type Props<A = any> = PropsQuery<A> | PropsMutation

function makeVariables<A = any>(props: Props<A>) {
  let collection

  if ('paginate' in props) {
    collection = props.paginate
  } else if ('get' in props) {
    collection = props.get
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
    collection,
    where: 'where' in props ? props.where : [],
    filters: {
      orderBy: 'orderBy' in props ? props.orderBy : null,
      size: 'size' in props ? props.size : null,
    }
  }
}

function getAction<A = any>(props: Props<A>) {
  if ('paginate' in props) {
    return 'getMany'
  } else if ('get' in props) {
    if ('id' in props) {
      return 'getById'
    }
    return 'getOne'
  } else if ('add' in props) {
    return 'add'
  } else if ('delete' in props) {
    return 'delete'
  } else if ('update' in props) {
    return 'update'
  } else if ('updateOne' in props) {
    return 'updateOne'
  }
}

export function Firestoreql<A = any>(props: Props<A>) {
  const ctx = React.useContext(BrowserqlContext)
  const contracts = makeContracts(ctx.schema as string)
  const variables = makeVariables<A>(props)

  const name = `firestore_${getAction<A>(props)}_${variables.collection}`

  if ('paginate' in props || 'get' in props) {
    return (
      <BrowserqlQuery<A>
        query={contracts.Query[name]}
        variables={variables}
        renderLoading={props.renderLoading}
        renderError={props.renderError}
        // @ts-ignore
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
