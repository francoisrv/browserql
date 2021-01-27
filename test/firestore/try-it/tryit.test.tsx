import React from 'react';
import renderer from 'react-test-renderer';
import App from '@browserql/examples/modules/firestore/try-it/files/tryit';

it('renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
