import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/allure-results/**',
      '**/allure-report/**',
      'apps/api/src/generated/**',
    ],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs}'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.flat.recommended.rules,
      'no-restricted-globals': ['error', 'Buffer', 'process'],
      'no-restricted-imports': ['error', { patterns: ['node:*'] }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: [
      'apps/web/vite.config.ts',
      'apps/api/**/*.ts',
      'packages/shared/**/*.ts',
      'tests/**/*.ts',
    ],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-restricted-globals': ['error', 'document', 'localStorage', 'sessionStorage', 'window'],
      'no-restricted-imports': ['error', { paths: ['react', 'react-dom'] }],
    },
  },
  {
    files: ['apps/web/src/test-setup.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['apps/web/src/**/*.test.{ts,tsx}', 'apps/api/**/*.test.ts'],
    languageOptions: {
      globals: globals.jest,
    },
  },
];
