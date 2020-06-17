import * as React from 'react'
import ReactDOM from 'react-dom'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

import Provider from '@browserql/react-provider'
import firestore from '@browserql/firestore'
import { useFirestore } from '@browserql/firestore-react-hooks'
import connect from '@browserql/client'
import GraphiQL from '@browserql/graphiql'

import schema from './firestore.graphql'

firebase.initializeApp({
  apiKey: 'AIzaSyDxx1IiOnwgZZzE0_YlGmCGGITQGL-VnQA',
  projectId: 'lestudio-75c34',
  appId: '1:337318935047:web:4ca842544422cc8c30c8a2',
  authDomain: 'lestudio-75c34.firebaseapp.com'
})

const db = firebase.firestore()

let query = db.collection("personalinfos")

query = query.doc('FiI4ElehVBWICakyuKU7')

query.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

// const plugins = [firestore(firebase.firestore())]

// function Companies() {
//   const [foos, { loading, error }] = useFirestore('Foo').find()
//   const [on, toggle] = React.useState(false)

//   if (error) {
//     return (
//       <div>
//         { error.message }
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div>
//         Loading
//       </div>
//     )
//   }

//   return (
//     <>
//       <button onClick={ () => toggle(!on) }>
//       ON
//       </button>
//       <ul>
//       {
//         foos.map(foo => (
//           <li key={ foo.id }>
//             { foo.name }
//           </li>
//         ))
//       }
//       </ul>
//       <GraphiQL />
//     </>
//   )
// }

// function App() {
//   return (
//     <div>
//       <Companies />
//     </div>
//   )
// }

// const client = connect({ schema, plugins })

// window.client = client

// ReactDOM.render(
//   <Provider client={ client }>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// )
