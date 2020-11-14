import type { ComponentType } from 'react'

interface Prop {}

export interface Epic<D> {
  title: string
  renderer: ComponentType<D>
  stories: Story<D>[]
  source?: string
  props?: { [prop in keyof D]: Prop }
}

export interface Story<D> {
  title: string
  description?: string
  props: D
}
