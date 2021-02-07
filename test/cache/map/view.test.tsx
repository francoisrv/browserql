import React from 'react';
import renderer from 'react-test-renderer';
import App from '@browserql/examples/modules/cache/map/files/view';

it('renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
