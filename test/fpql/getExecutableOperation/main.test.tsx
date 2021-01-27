import React from 'react';
import renderer from 'react-test-renderer';
import App from '@browserql/examples/modules/fpql/getExecutableOperation/files/main';

it('renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
