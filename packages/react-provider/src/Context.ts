import * as React from 'react'
import { Client } from 'browserql/src'

export default React.createContext<Client | null>(null)