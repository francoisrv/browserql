import { FirestoreqlModifier, FirestoreqlType } from '../types'

export default function last(): FirestoreqlModifier {
  return {
    type: FirestoreqlType.getter,
    name: 'last',
  }
}
