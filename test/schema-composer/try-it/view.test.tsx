import React from 'react';
import renderer from 'react-test-renderer';
import App from '@browserql/examples/modules/schema-composer/try-it/files/view';

it('renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
