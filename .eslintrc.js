module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['simple-import-sort', 'import'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        parser: 'flow',
        endOfLine: 'crlf',
        arrowParens: 'always',
        proseWrap: 'preserve',
      },
    ],
    'no-unused-vars': 1,
    'no-console': 1,
  },
};
