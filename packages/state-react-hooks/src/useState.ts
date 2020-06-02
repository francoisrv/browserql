import * as React from 'react'
import Context from 'browserql-react-provider/src/Context'
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

  function getInitialStateValue(path: string) {
    return client.getContext(`state.${ path }.value`)
  }
  
  const getCache = () => {
    const data = client.readQuery(queryName)
    if (typeof data === 'undefined') {
      return getInitialStateValue('State.counter')
    }
    return data
  }

  function getter() {
    const results = useQuery(client.getQuery(queryName))
    return [
      get(results, `data.${ queryName }`, undefined),
      results
    ]
  }

  function setter() {
    const mutationName = `set${ name }`
    const [trigger, results] = useMutation(
      client.getMutation(mutationName)
    )
    return [
      (variables: any) => {
        console.log({variables})
        trigger({variables})
      },
      results
    ]
  }

  function upsetter() {

  }

  setter.increment = () => {

  }
  
  return {
    get: getter,
    set: setter
  }
}