import { find, isNull } from 'lodash'
import React, { ComponentType, ReactElement, useEffect, useState } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'

import imports from '@browserql/examples/imports'

interface Props {
  section: string
  example: string
  file: string
}

export default function Render({ section, example, file }: Props) {
  const [component, setComponent] = useState<ReactElement | null>(null)
  const [loading, setLoading] = useState(false)

  const loadComponent = async () => {
    setLoading(true)
    const node = find(imports, {
      module: section,
      example,
      file,
    })
    if (!node) {
      setComponent(
        <div>
          Node not found with module {section} and example {example} and file{' '}
          {file}
        </div>
      )
    }
    const Node = await node?.load()
    if (Node.height) {
      const iframe = window.parent.document.querySelector(
        `iframe[src="${window.location.pathname}"]`
      )
      if (iframe) {
        iframe.style.height = `${Node.height}px`
      }
    }
    setComponent(<Node />)
    setLoading(false)
  }

  useEffect(() => {
    if (isNull(component) && !loading) {
      loadComponent()
    }
  }, [component])
  if (component) {
    return component
  }
  return <Skeleton variant="rect" width="100%" height={118} />
}
