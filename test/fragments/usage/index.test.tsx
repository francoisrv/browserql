import React from 'react';
import renderer from 'react-test-renderer';
import App from '@browserql/examples/modules/fragments/usage/files/index';

it('renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
