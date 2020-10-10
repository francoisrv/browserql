import { Query } from './utils';

interface Props {
  get: string
  where?: Query[]
  render: () => React.ReactNode
}

export function Firestoreql(props: Props) {
  return <GraphQLQuery />
}
