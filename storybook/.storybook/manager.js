// .storybook/manager.js

import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import theme from './theme'

addons.setConfig({
  theme: {
    ...themes.dark,
    brandTitle: 'browserql',
    brandUrl: 'https://example.com',
    brandImage: 'https://placehold.it/350x150',
  },
});