// .storybook/preview.js

import { themes } from '@storybook/theming';
import theme from './theme'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  docs: {
    theme,
  },
}