import { Context } from '@browserql/react-provider'
import React from 'react'

export default function useQuery<T extends any>(queryName: string, variables?: any): T {
  const contextClient = React.useContext(Context)
  if (!contextClient) {
    throw new Error('No client found')
  }
  const client = contextClient
  const [data, setData] = React.useState(client.query(queryName, variables))
  const query = client.getQuery(queryName)
  if (!query) {
    throw new Error(`Unknown query: ${ queryName }`)
  }
  
  React.useEffect(() => {
    const observable = client.apollo.watchQuery({
      query,
      variables
    })
    const sub = observable.subscribe(({ data: nextData }: any) => {
      console.log({nextData})
      // const nextValue = nextData[queryName]
      // if (data !== nextValue) {
      //   console.log('update')
      //   // setData(nextValue)
      // }
    })
    return () => {
      sub.unsubscribe()
    }
  })
  console.log({data})
  return data
}
