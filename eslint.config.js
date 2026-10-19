import url from 'node:url'
import config from '@tpluscode/eslint-config'
import { includeIgnoreFile } from 'eslint/config'

const tsconfigRootDir = url.fileURLToPath(new URL('.', import.meta.url))

export default [
  ...config,
  includeIgnoreFile(url.fileURLToPath(new URL('.gitignore', import.meta.url))),
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir,
      },
    },
  },
  {
    files: [
      "packages/env-bundle/*"
    ],
    rules:{
      'import-x/no-extraneous-dependencies': 'off'
    }
  },
  {
    files: ['packages/**/*.d.ts'],
    rules:{
      'n/no-unpublished-import': 'off'
    }
  }
]
