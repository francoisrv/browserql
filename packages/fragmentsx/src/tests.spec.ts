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
