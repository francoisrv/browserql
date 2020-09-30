mkdir packages/$1
mkdir packages/$1/src

cat <<JSON > packages/$1/package.json
{
  "name": "@browserql/$1",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "license": "ISC",
  "keywords": [
    "browserql",
    "graphql",
    "apollo",
    "browser"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/francoisrv/browserql.git"
  },
  "bugs": {
    "url": "https://github.com/francoisrv/browserql/issues"
  },
  "scripts": {
    "build": "rm -rf dist && yarn tsc",
    "watch": "yarn build -w",
    "test": "jest dist",
    "prepublishOnly": "npm run build && npm test"
  }
}
JSON

cat <<MD > packages/$1/README.md
$1
===
MD

cat <<JSON > packages/$1/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "types": ["jest"]
  }
}
JSON

cat <<TXT > packages/$1/.npmignore
!dist
src
node_modules
yarn-error.log
TXT

cat <<TS > packages/$1/src/index.ts
// ...
TS

yarn
yarn w $1 add -D typescript jest @types/jest @types/node
