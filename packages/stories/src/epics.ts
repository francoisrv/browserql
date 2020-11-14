import type { ComponentType } from 'react'
import { Story, Epic } from './types'

interface EpicConfig<D> {
  title: string
  source?: string
  props?: Epic<D>['props']
}

export default function epics<D>(
  title: string | EpicConfig<D>,
  renderer: ComponentType<D>,
  stories: Story<D>[]
): Epic<D> {
  return {
    title: typeof title === 'string' ? title : title.title,
    renderer,
    stories,
    source: typeof title === 'string' ? '' : title.source,
  }
}
