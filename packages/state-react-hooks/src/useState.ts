import * as React from 'react'
import Context from 'browserql-react-provider/src/Context'
import { useQuery, useMutation } from '@apollo/react-hooks'
import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'
import get from 'lodash.get'

export default function useState(path: string) {
  const client = React.useContext(Context)
  const name = upperFirst(camelCase(path))
  const queryName = `get${ name }`
  const transaction =  client.transaction(queryName)
  
  const getCache = () => {
    const { data } = client.apollo.readQuery({
      query: transaction.node
    })
    if (typeof data === 'undefined') {
      return client.context.state.State.counter.value
    }
    return data
  }
  
  return {
    get: () => {
      const results = useQuery(transaction.node)
      return [
        get(results, `data.${ queryName }`, undefined),
        results
      ]
    },
    set: () => {
      const mutationName = `set${ name }`
      const [trigger, results] = useMutation(
        client.transaction(mutationName).node
      )
      return [
        (variables: any) => {
          console.log({variables})
          trigger({variables})
        },
        results
      ]
    },
    increment: () => {
      const mutationName = `set${ name }`
      const [trigger, results] = useMutation(
        client.transaction(mutationName).node
      )
      return [
        (variables: any) => {
          const data = getCache()
          console.log({data})
          const nextData = (data || 0) + 1
          trigger({
            variables: { value: nextData },
            update: (store) => {
              client.apollo.writeQuery({
                query: transaction.node,
                data: {
                  [queryName]: nextData
                }
              })
            }
          })
        },
        results
      ]
    }
  }
}