import type { BrowserqlClient } from '@browserql/types'
import { createContext } from 'react'

const BrowserqlContext = createContext<BrowserqlClient>(
  // @ts-ignore
  {}
)

export default BrowserqlContext
