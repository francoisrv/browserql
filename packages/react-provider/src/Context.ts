import * as React from 'react'
import { Client } from '@browserql/client'

export default React.createContext<Client | null>(null)