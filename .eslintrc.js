module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-tabs': 'off',
    eqeqeq: 'off',
    'space-before-blocks': 'off',
    indent: 'off',
    'space-before-function-paren': 'off',
    semi: 'off',
    'object-curly-spacing': 'off',
    camelcase: 'off',
    'dot-notation': 'off'
  }
}
