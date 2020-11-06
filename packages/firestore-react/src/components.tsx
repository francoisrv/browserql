import {
  BrowserqlContext,
  BrowserqlMutation,
  BrowserqlQuery,
} from '@browserql/react'
import React, { ReactNode } from 'react'
import makeContracts from '@browserql/contracts'
import { Query } from '@browserql/firestore'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

type QueryAction = { paginate: string } | { get: string }

type MutationAction =
  | { addOne: string }
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
  renderError?: ReactNode | ((props: { error: Error }) => ReactNode)
  renderNull?: ReactNode
  renderEmpty?: ReactNode
}

interface Extra {
  loading: boolean
  error?: Error
}

type FirestoreqlPropsQuery<A = any> = QueryAction &
  Option &
  Renders & { children: (data: A, extra: Extra) => ReactNode }

type FirestoreqlPropsMutation<A = any> = MutationAction &
  Renders & {
    children: (action: any, extra: Extra) => ReactNode
  }

export type FirestoreqlProps<A = any> =
  | FirestoreqlPropsQuery<A>
  | FirestoreqlPropsMutation

function makeVariables<A = any>(props: FirestoreqlProps<A>) {
  let collection

  if ('paginate' in props) {
    collection = props.paginate
  } else if ('get' in props) {
    collection = props.get
  } else if ('addOne' in props) {
    collection = props.addOne
  } else if ('delete' in props) {
    collection = props.delete
  } else if ('update' in props) {
    collection = props.update
  } else if ('updateOne' in props) {
    collection = props.updateOne
  }

  const where: Query[] = []

  if ('where' in props && Array.isArray(props.where)) {
    where.push(...props.where)
  }

  return {
    collection,
    where,
    id: 'id' in props ? props.id : null,
    filters: {
      orderBy: 'orderBy' in props ? props.orderBy : null,
      size: 'size' in props ? props.size : null,
    },
  }
}

function getAction<A = any>(props: FirestoreqlProps<A>) {
  if ('paginate' in props) {
    return 'paginate'
  } else if ('get' in props) {
    if ('id' in props) {
      return 'getById'
    }
    return 'getOne'
  } else if ('addOne' in props) {
    return 'addOne'
  } else if ('delete' in props) {
    return 'delete'
  } else if ('update' in props) {
    return 'update'
  } else if ('updateOne' in props) {
    return 'updateOne'
  }
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error && error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export function Firestoreql<A = any>(props: FirestoreqlProps<A>) {
  const ctx = React.useContext(BrowserqlContext)
  const contracts = makeContracts(ctx.schema as string)
  const variables = makeVariables<A>(props)

  const name = `firestore_${getAction<A>(props)}_${variables.collection}`

  if ('paginate' in props || 'get' in props) {
    const contract = contracts.Query[name]

    if (!contract) {
      if (props.renderError) {
        if (typeof props.renderError === 'function') {
          return props.renderError({
            error: new Error(`Query not found: ${name}`),
          })
        } else {
          return props.renderError
        }
      }
    }

    return (
      <BrowserqlQuery<A>
        query={contracts.Query[name]}
        variables={variables}
        renderLoading={props.renderLoading}
        renderError={props.renderError}
        // @ts-ignore
        render={props.children}
        // @ts-ignore
        renderEach={props.renderEach}
        // @ts-ignore
        renderEmpty={props.renderEmpty}
        // @ts-ignore
        renderNull={props.renderNull}
      />
    )
  }

  const contract = contracts.Mutation[name]

  if (!contract) {
    if (props.renderError) {
      if (typeof props.renderError === 'function') {
        return props.renderError({
          error: new Error(`Mutation not found: ${name}`),
        })
      } else {
        return props.renderError
      }
    }
  }

  return (
    <ErrorBoundary
      // @ts-ignore
      FallbackComponent={props.renderError || ErrorFallback}
    >
      <BrowserqlMutation
        mutation={contracts.Mutation[name]}
        renderLoading={props.renderLoading}
        renderError={(error) => {
          if (typeof props.renderError === 'function') {
            return props.renderError({ error })
          }
          if (props.renderError) {
            return props.renderError
          }
        }}
        render={(fn, extra) => {
          return props.children(async (input: any) => {
            try {
              await fn({ input })
            } catch (error) {
              if (typeof props.renderError === 'function') {
                return props.renderError({ error })
              }
              if (props.renderError) {
                return props.renderError
              }
              throw error
            }
          }, extra)
        }}
      />
    </ErrorBoundary>
  )
}
