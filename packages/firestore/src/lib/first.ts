import { FirestoreqlModifier, FirestoreqlType } from '../types'

export default function first(): FirestoreqlModifier {
  return {
    type: FirestoreqlType.getter,
    name: 'first',
  }
}
