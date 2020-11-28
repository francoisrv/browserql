import { FirestoreqlModifier, FirestoreqlType } from '../types'

export default function asc(value: boolean): FirestoreqlModifier {
  return {
    type: FirestoreqlType.getter,
    name: 'asc',
    value,
  }
}
