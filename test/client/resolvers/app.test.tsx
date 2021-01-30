import React from 'react';
import renderer from 'react-test-renderer';
import App from '@browserql/examples/modules/client/resolvers/files/app';

it('renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});