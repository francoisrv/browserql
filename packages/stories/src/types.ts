import type { ComponentType } from 'react'

export interface Prop {
  type?: PropType
  print?: (s: any) => string
  indentation?: number
}

export interface Epic<D> {
  title: string
  renderer: ComponentType<D>
  stories: Story<D>[]
  source?: string
  props?: { [prop in keyof Partial<D>]: Prop } | {}
  description?: string
}

export interface Story<D> {
  title: string
  description?: string
  props: D
}

export type PropType = 'custom'
