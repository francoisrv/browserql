// __test-utils__/custom-jest-environment.js
// Stolen from: https://github.com/ipfs/jest-environment-aegir/blob/master/src/index.js
// Overcomes error from jest internals.. this thing: https://github.com/facebook/jest/issues/6248
"use strict";

const NodeEnvironment = require("jest-environment-node");
const DomEnvironment = require("jest-environment-jsdom");


module.exports = class MyEnvironment extends DomEnvironment {
  constructor(config) {
    // console.log('document')
    // const doc = new DomEnvironment(config)
    super(
      Object.assign({}, config, {
        globals: Object.assign({}, config.globals, {
          Uint32Array: Uint32Array,
          Uint8Array: Uint8Array,
          ArrayBuffer: ArrayBuffer,
          // document: doc.global.document
        }),
      }),
    );
  }

  async setup() {}

  async teardown() {}

}
