/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    ignorePatterns: ['*.config.js'],
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
    env: {
        'vue/setup-compiler-macros': true,
    },
};
