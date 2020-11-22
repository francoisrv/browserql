import type { ReactElement } from 'react'
import { useState } from 'react'

interface Props<P = any> {
  initial?: P
  children: (state: P, setState: (p: P) => void) => ReactElement
}

export default function UseState<P = any>(props: Props<P>) {
  const { children, initial } = props
  const [state, setState] = useState<P>(initial as P)
  return children(state, setState)
}
