import { FirestoreqlModifier, FirestoreqlType } from '../types'

export default function limit(value: number): FirestoreqlModifier {
  return {
    type: FirestoreqlType.getter,
    name: 'limit',
    value,
  }
}
