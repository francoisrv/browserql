import React from 'react';
import renderer from 'react-test-renderer';
import App from '@browserql/examples/modules/executable/usage/files/mutation';

it('renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
