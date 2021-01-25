import { BrowserqlProvider } from '@browserql/react'
import * as React from 'react'
import { connectHttp } from '@browserql/http'
import { JSONResolver } from 'graphql-scalars'

import Response from './response'
import { schema } from '../loaders'

export default function Example() {
  return (
    <BrowserqlProvider
      schema={schema}
      extensions={[connectHttp()]}
      scalars={{
        JSON: JSONResolver,
      }}
    >
      <Response id={2} />
    </BrowserqlProvider>
  )
}

Example.height = 340
