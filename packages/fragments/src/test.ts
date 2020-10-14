import buildFragments from '.';

const schema = `
type Category {
  id: ID!
  name: String!
}

type Todo {
  id: ID!
  name: String!
  done: Boolean!
  category: Category!
}

type User {
  id: ID
}

type Post {
  users: [User]
}

type Query {
  getTodo: Todo
}

type Mutation {
  getPosts: Post
}
`;

test('[query] it should print fragment', () => {
  const fragments = buildFragments(schema);
  const category = fragments.get('Category');
  expect(category).toEqual(`fragment CategoryFragment on Category {
  id
  name
}`);
});

test('[query] it should print nested fragments', () => {
  const fragments = buildFragments(schema);
  const todo = fragments.get('Todo');
  expect(todo?.split('\n')).toEqual(
    `fragment TodoFragment on Todo {
  id
  name
  done
  category {
    ...CategoryFragment 
  }
}
fragment CategoryFragment on Category {
  id
  name
}`.split('\n')
  );
});

test('[mutation] it should print fragment', () => {
  const fragments = buildFragments(schema);
  const user = fragments.get('User');
  expect(user).toEqual(`fragment UserFragment on User {
  id
}`);
});

test('[mutation] it should print nested fragments', () => {
  const fragments = buildFragments(schema);
  const todo = fragments.get('Post');
  expect(todo?.split('\n')).toEqual(
    `fragment PostFragment on Post {
  users {
    ...UserFragment 
  }
}
fragment UserFragment on User {
  id
}`.split('\n')
  );
});

test.only('bug 44', () => {
  const fragments = buildFragments(`
  type Query {
    browserqlQuery: ID
    
    getProjectHours(project: ID!): Int!
    
    firestore_paginate_Project(where: [FirestoreWhere], filters: FirestoreFilters): [Project!]!
    
    firestore_getOne_Project(where: [FirestoreWhere], filters: FirestoreFilters): Project
    
    firestore_getById_Project(id: ID!): Project
    
    firestore_paginate_Page(where: [FirestoreWhere], filters: FirestoreFilters): [Page!]!
    
    firestore_getOne_Page(where: [FirestoreWhere], filters: FirestoreFilters): Page
    
    firestore_getById_Page(id: ID!): Page
    
    firestore_paginate_ProjectIntegration(where: [FirestoreWhere], filters: FirestoreFilters): [ProjectIntegration!]!
    
    firestore_getOne_ProjectIntegration(where: [FirestoreWhere], filters: FirestoreFilters): ProjectIntegration
    
    firestore_getById_ProjectIntegration(id: ID!): ProjectIntegration

    firestore_paginate_Integration(where: [FirestoreWhere], filters: FirestoreFilters): [Integration!]!
    
    firestore_getOne_Integration(where: [FirestoreWhere], filters: FirestoreFilters): Integration
    
    firestore_getById_Integration(id: ID!): Integration
  }
  
  type Mutation {
    browserqlMutation: ID
  }
  
  scalar JSON
  
  directive @firestore(collection: String) on OBJECT
  
  directive @firestore_ref on FIELD_DEFINITION
  
  enum FirestoreWhereOperator {
    equals
  }
  
  input FirestoreFilters {
    page: Int
    size: Int
    orderBy: String
  }
  
  input FirestoreWhere {
    field: String!
    operator: FirestoreWhereOperator!
    value: JSON!
  }
  
  type Project @firestore {
    name: String!
    id: ID!
  }
  
  type Page @firestore {
    name: String!
    project: ID!
    description: String!
    media: String!
    hours: Int!
    price: Int!
    id: ID!
  }
  
  type Integration @firestore {
    hours: Int!
    name: String!
    price: Int!
    subheader: String!
    media: String!
    id: ID!
  }
  
  type ProjectIntegration @firestore {
    project: ID!
    integration: Integration! @firestore_ref
    id: ID!
  }
  
  schema {
    query: Query
    mutation: Mutation
  }
  `)
  console.log(fragments.get('ProjectIntegration'))
});
