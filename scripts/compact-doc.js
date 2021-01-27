const { readdir, readFile, stat, writeFile, mkdir } = require('fs')
const { set, compact, mapKeys, last, upperFirst } = require('lodash')
const { join } = require('path')
const { promisify } = require('util')
const { exec } = require('child_process')
const vm = require('vm')

function findLanguageByExtension(fileName) {
  const extension = last(fileName.split(/\./))
  switch (extension) {
    case 'mjs':
    case 'mjsx':
      return 'javascript'
    case 'tsx':
      return 'typescript'
    case 'graphql':
      return 'graphql'
  }
}

function printSnippet(snippet, fileName) {
  if (/\.mjs$/.test(fileName)) {
    return snippet.replace(/\.default/g, '').replace(/globalThis\./g, '')
  }
  return snippet
}

function runScript(file, ctx) {
  const extension = last(file.name.split(/\./))
  switch (extension) {
    case 'mjs':
      return `\`\`\`component
${JSON.stringify(
  {
    component: './Code',
    props: {
      language: 'json',
      value: file.result,
    },
  },
  null,
  2
)}
\`\`\``
  }
}

function transform(source, ctx) {
  let src = source
  ctx.files.forEach((file) => {
    const SHOW = `\{\{ show ${file.name} \}\}`
    const RUN = `\{\{ run ${file.name} \}\}`
    const RENDER = `\{\{ render ${file.name} \}\}`

    src = src.replace(new RegExp(RUN, 'g'), runScript(file, ctx))

    src = src.replace(
      new RegExp(SHOW, 'g'),
      `\`\`\`${findLanguageByExtension(file.name)}
${printSnippet(file.source.trim(), file.name)}
\`\`\``
    )

    src = src.replace(
      new RegExp(RENDER, 'g'),
      `\`\`\`react
${JSON.stringify({ file, ctx }, null, 2)}
\`\`\``
    )
  })
  return src
}

async function tree(dir) {
  const repTree = {}
  const files = await promisify(readdir)(dir)
  await Promise.all(
    files.map(async (file) => {
      const x = await promisify(stat)(join(dir, file))
      if (x.isDirectory()) {
        repTree[file] = await tree(join(dir, file))
      } else {
        repTree[file] = 1
      }
    })
  )
  return repTree
}

async function fillTree(repTree, path = '') {
  const examples = []

  const promises = []

  const versions = []

  const imports = []

  mapKeys(repTree, (_a, moduleKey) => {
    promises.push(
      (async () => {
        if (repTree[moduleKey] !== 1) {
          const jsonSource = await promisify(readFile)(
            `packages/${moduleKey}/package.json`
          )
          const json = JSON.parse(jsonSource.toString())
          versions.push({
            name: moduleKey,
            version: json.version,
            description: json.description,
          })
          try {
            await promisify(mkdir)(`test/${moduleKey}`)
          } catch (error) {}
        }
      })()
    )
    mapKeys(repTree[moduleKey], (value, exampleKey) => {
      const promise = async () => {
        const settingsFile = join('packages/examples/modules', moduleKey, exampleKey, 'settings.json')

        const index = await promisify(readFile)(
          join('packages/examples/modules', moduleKey, exampleKey, 'index.md')
        )
        const files = []
        const filePromises = []
        mapKeys(value.files, (file, fileName) => {
          filePromises.push(async () => {
            const source = await promisify(readFile)(
              join(
                'packages/examples/modules',
                moduleKey,
                exampleKey,
                'files',
                fileName
              )
            )

            if (/\.mjs$/.test(fileName)) {
              const result = await promisify(exec)(
                `node ./scripts/output-file.mjs ${moduleKey} ${exampleKey} ${fileName}`
              )
              files.push({
                name: fileName,
                source: source.toString(),
                result: result.stdout,
              })
            } else if (/\.tsx$/.test(fileName)) {
              promises.push((async () => {
                try {
                  await promisify(mkdir)(`test/${moduleKey}/${exampleKey}`)
                } catch (error) {}
                await promisify(writeFile)(
                  `test/${moduleKey}/${exampleKey}/${fileName.replace(/\.tsx$/, '')}.test.tsx`,
                  `import React from 'react';
import renderer from 'react-test-renderer';
import App from '@browserql/examples/modules/${moduleKey}/${exampleKey}/files/${fileName.replace(/\.tsx$/, '')}';

it('renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
`
                )
              })())
              files.push({ name: fileName, source: source.toString() })
              imports.push(`
  {
    module: '${moduleKey}',
    example: '${exampleKey}',
    file: '${fileName.replace(/\.tsx$/, '')}',
    async load() {
      const { default: loaded } = await import(
        './modules/${moduleKey}/${exampleKey}/files/${fileName.replace(
                /\.tsx$/,
                ''
              )}'
      )
      return loaded
    },
  }`)
            } else {
              files.push({ name: fileName, source: source.toString() })
            }
          })
        })
        await Promise.all(filePromises.map((p) => p()))
        examples.push({
          module: moduleKey,
          name: exampleKey,
          index: index.toString(),
          files,
          bundle: transform(index.toString(), {
            module: moduleKey,
            name: exampleKey,
            files,
          }),
        })
        console.log('Built', moduleKey, exampleKey)
      }
      promises.push(promise())
    })
  })

  await Promise.all(promises)

  await promisify(writeFile)(
    'packages/examples/versions.json',
    JSON.stringify(versions, null, 2).concat('\n')
  )

  await promisify(writeFile)(
    'packages/examples/imports.ts',
    `export default [${imports.join(',\n')}]\n`
  )

  return examples
}

async function run() {
  const repTree = await tree('packages/examples/modules')
  const examples = await fillTree(repTree)
  await promisify(writeFile)(
    'packages/examples/examples.json',
    JSON.stringify(
      examples.map((example) => ({
        module: example.module,
        name: example.name,
        bundle: example.bundle,
      })),
      null,
      2
    ).concat('\n')
  )
}

run()
