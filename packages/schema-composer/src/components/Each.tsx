import React, { ReactElement } from 'react'

export default function Each<A>({
  of,
  children,
}: {
  of: A[]
  children(item: A, index: number, all: A[]): ReactElement
}) {
  return <>{of.map(children)}</>
}
