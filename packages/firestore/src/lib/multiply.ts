import { FirestoreqlModifier, FirestoreqlType } from '../types'

export default function multiply(value: number): FirestoreqlModifier {
  return {
    type: FirestoreqlType.getter,
    name: 'multiply',
    value,
  }
}
