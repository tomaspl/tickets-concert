import { defineFlatConfig } from 'eslint-define-config'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierPlugin from 'eslint-plugin-prettier'
import ngTemplatePlugin from '@angular-eslint/eslint-plugin-template'
import ngTemplateParser from '@angular-eslint/template-parser'

export default defineFlatConfig([
  {
    files: ['**/*.ts'],
    ignores: ['node_modules/**', '.angular/**', '.vite/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'no-trailing-spaces': 'error',
      'lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
    },
  },

  {
    files: ['**/*.html'],
    ignores: ['node_modules/**', '.angular/**', '.vite/**'],
    languageOptions: {
      parser: ngTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': ngTemplatePlugin,
    },
    rules: {
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'no-trailing-spaces': 'error',
    },
  },
])
