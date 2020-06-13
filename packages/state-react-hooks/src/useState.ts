import * as React from 'react'
import { Context } from '@browserql/react-provider'
import { useQuery, useMutation } from '@apollo/react-hooks'
import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'
import get from 'lodash.get'

export default function useState(path: string) {
  const contextClient = React.useContext(Context)
  if (!contextClient) {
    return [
      undefined,
      {
        error: new Error('No client found')
      }
    ]
  }
  const client = contextClient
  const name = upperFirst(camelCase(path))
  const queryName = `get${ name }`

  function getter() {
    const query = client.getQuery(queryName)
    if (!query) {
      return [
        undefined,
        {
          loading: false,
          error: new Error(`Could not find query ${ queryName }`)
        }
      ]
    }
    const results = useQuery(query)
    return [
      get(results, `data.${ queryName }`, undefined),
      results
    ]
  }

  function mutate(mutationName: string) {
    const mutation = client.getMutation(mutationName)
    if (!mutation) {
      console.log(`Could not find mutation: ${ mutationName }`)
      return [
        () => {},
        {
          error: new Error(`Could not find mutation: ${ mutation }`)
        }
      ]
    }
    const [trigger, results] = useMutation(mutation)
    return [
      (variables: any) => {
        trigger({variables})
      },
      results
    ]
  }

  function setter() {
    return mutate(`set${ name }`)
  }

  function toggle() {
    return mutate(`toggle${ name }`)
  }
  
  return {
    get: getter,
    set: setter,
    toggle,
  }
}