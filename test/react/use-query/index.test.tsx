import React from 'react';
import renderer from 'react-test-renderer';
import App from '@browserql/examples/modules/react/use-query/files/index';

it('renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
