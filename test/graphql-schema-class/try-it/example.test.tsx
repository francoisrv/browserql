import React from 'react';
import renderer from 'react-test-renderer';
import App from '@browserql/examples/modules/graphql-schema-class/try-it/files/example';

it('renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});