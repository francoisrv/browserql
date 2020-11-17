import * as React from 'react'
import BrowserqlQuery from './react/test.mdx'
import FirestoreReact from './epics/firestore-react.mdx'
import GraphiQL from './epics/graphiql.mdx'

const epics = [
  {
    title: 'React',
    mdx: BrowserqlQuery,
  },
  {
    title: 'Firestore React',
    mdx: FirestoreReact,
  },
  {
    title: 'GraphiQL',
    mdx: GraphiQL,
  },
]

function NavLi(props: { title: React.ReactNode; onClick: () => void }) {
  return (
    <li style={{ display: 'inline', textTransform: 'uppercase' }}>
      <button
        style={{
          fontSize: 16,
          padding: 12,
          textTransform: 'uppercase',
          border: '2px solid #aaa',
          borderBottom: '4px dotted #777',
          borderRadius: '6px 6px 0 0',
          fontWeight: 'bold',
        }}
        onClick={props.onClick}
      >
        {props.title}
      </button>
    </li>
  )
}

function Nav(props: { setEpic: (epic: any) => void }) {
  return (
    <nav>
      <ul style={{ listStyleType: 'none' }}>
        {epics.map((epic) => (
          <NavLi
            key={epic.title}
            title={epic.title}
            onClick={() => props.setEpic(epic)}
          />
        ))}
      </ul>
    </nav>
  )
}

function AppBar() {
  return (
    <header>
      <h1>browserql stories</h1>
    </header>
  )
}

export default function App() {
  const [epic, setEpic] = React.useState(epics[2])

  return (
    <div>
      <Nav setEpic={setEpic} />
      <div style={{ padding: 32 }}>
        <epic.mdx />
      </div>
    </div>
  )
}
