/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    ignorePatterns: ['*.config.js'],
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
    env: {
        'vue/setup-compiler-macros': true,
        node: true,
    },
    rules: {
        indent: ['error', 4, {
            SwitchCase: 1,
        }],
        'comma-dangle': ['error', 'always-multiline'],
        semi: [2, 'always'],
        quotes: [2, 'single'],
        'no-console': 'off',
        'no-unused-vars': 'off',
        'no-trailing-spaces': 'error',
        'no-multiple-empty-lines': ['error', {
            max: 1,
        }],
        'vue/max-attributes-per-line': ['error', {
            singleline: {
                max: 20,
            },
            multiline: {
                max: 1,
            },
        }],
    },
};
