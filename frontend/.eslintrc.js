module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['unused-imports', 'simple-import-sort'],
  rules: {
    'react/no-unknown-property': [
      2,
      {
        ignore: ['jsx'],
      },
    ],
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // Side effect imports
          ['^\\u0000'],
          // Packages
          ['^@?\\w'],
          // Absolute imports and anything not matched in another group
          ['^(components/|styles/|types/)?'],
          // Relative imports
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
}
