import React from 'react';
import renderer from 'react-test-renderer';
import App from '@browserql/examples/modules/http/about/files/response';

it('renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
