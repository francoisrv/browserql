import { FirestoreqlModifier, FirestoreqlType } from '../types'

export default function increment(value: number): FirestoreqlModifier {
  return {
    type: FirestoreqlType.getter,
    name: 'increment',
    value,
  }
}
