const { defineFlatConfig } = require('eslint-define-config')

const tsPlugin = require('@typescript-eslint/eslint-plugin')
const prettierPlugin = require('eslint-plugin-prettier')
const ngTemplatePlugin = require('@angular-eslint/eslint-plugin-template')

module.exports = defineFlatConfig([
  {
    files: ['**/*.ts'],
    ignores: ['node_modules/**', '.angular/**', '.vite/**'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
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
      parser: '@angular-eslint/template-parser',
    },
    plugins: {
      '@angular-eslint/template': ngTemplatePlugin,
    },
    extends: ['plugin:@angular-eslint/template/recommended'],
    rules: {
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'no-trailing-spaces': 'error',
    },
  },
])
const { defineFlatConfig } = require('eslint-define-config')

module.exports = defineFlatConfig([
  {
    files: ['**/*.ts'],
    ignorePatterns: ['node_modules/**', '.angular/**', '.vite/**'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
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
    languageOptions: {
      parser: '@angular-eslint/template-parser',
    },
    plugins: ['@angular-eslint/template'],
    extends: ['plugin:@angular-eslint/template/recommended'],
    rules: {
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'no-trailing-spaces': 'error',
    },
  },
])
