import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import pluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  eslintConfigPrettier, // Ensures Prettier formatting rules are applied last
  {
    plugins: { prettier: pluginPrettier }, // ✅ Explicitly import the Prettier plugin
    rules: {
      'prettier/prettier': 'error', // ✅ Now ESLint can find the rule
      //'@typescript-eslint/explicit-module-boundary-types': 'error',
      //'@typescript-eslint/explicit-function-return-type': 'error',
      //'@typescript-eslint/typedef': [
      //  'error',
      //  {
      //    arrowParameter: true,
      //    variableDeclaration: true,
      //    memberVariableDeclaration: true,
      //  },
      //],
      //'@typescript-eslint/no-explicit-any': 'warn',
      'vue/require-default-prop': 'error',
      'vue/require-prop-types': 'error',
    },
  },
];
