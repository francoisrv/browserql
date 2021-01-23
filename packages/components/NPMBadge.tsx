import * as React from 'react'
// @ts-ignore no types from typed, so we'll need to do it ourself #TODO
import NpmApi from 'npm-api'
import MD from './MD'

interface Props {
  pkg: string
}

export default function NPMBadge(props: Props) {
  const { pkg } = props
  return (
    <MD
      doc={`[![NPM](https://nodei.co/npm/@browserql/${pkg}.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@browserql/${pkg})

  [![ISC License](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)
  [![Type](https://img.shields.io/npm/types/typescript)](https://www.typescriptlang.org/)
  [![NPM Version](https://img.shields.io/npm/v/@browserql/${pkg})](https://www.npmjs.com/package/@browserql/${pkg})
  [![NPM downloads](https://img.shields.io/npm/dt/@browserql/${pkg})](https://www.npmjs.com/package/@browserql/${pkg})
  [![NPM downloads](https://img.shields.io/npm/dw/@browserql/${pkg})](https://www.npmjs.com/package/@browserql/${pkg})
  [![NPM downloads](https://img.shields.io/npm/dm/@browserql/${pkg})](https://www.npmjs.com/package/@browserql/${pkg})`}
    />
  )
}
