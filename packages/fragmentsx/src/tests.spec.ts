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

type Query {
  getTodo: Todo
}
`;

test('it should print fragment', () => {
  const fragments = buildFragments(schema);
  const category = fragments.get('Category');
  expect(category).toEqual(`fragment CategoryFragment on Category {
  id
  name
}`);
});

test('it should print nested fragments', () => {
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
