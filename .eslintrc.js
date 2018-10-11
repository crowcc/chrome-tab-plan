module.exports = {
    root: true,
    env: {
        node: true,
    },
    plugins: ['vue'],
    extends: ['plugin:vue/essential', '@vue/airbnb'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'object-shorthand': 0,
        'no-shadow': 0,
        'no-param-reassign': 0,
        'consistent-return': 0,
        'import/extensions': 0,
        'max-len': 0,
        indent: ['error', 2],
        'vue/html-indent': ['error', 2],
        'vue/script-indent': ['error', 2],
        'import/prefer-default-export':0,
        'import/no-extraneous-dependencies':0
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
