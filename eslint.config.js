// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

/**
 * Project rules for templates (.astro): keep links BASE_PATH-aware and content in locales/.env.
 * @type {import('eslint').Linter.RulesRecord}
 */
const templateRules = {
  'no-restricted-syntax': [
    'error',
    {
      selector: 'JSXAttribute[name.name=/^(href|src)$/] > Literal[value=/^\\/(?!\\/)/]',
      message: 'Root-relative paths break under BASE_PATH. Use href()/section() from src/i18n or url() from src/site.',
    },
    {
      selector: 'JSXAttribute > Literal[value=/^tel:/]',
      message: 'Use site.phoneHref (built from .env).',
    },
    {
      selector: 'JSXText[value=/\\p{L}{2,}/u]',
      message: 'User-facing text belongs in src/i18n/*.json (or .env for business data), not in templates.',
    },
    {
      selector: "JSXAttribute[name.name='style']",
      message: 'Use Tailwind utilities or src/styles/global.css instead of inline styles.',
    },
  ],
};

export default defineConfig(
  { ignores: ['build/', '.astro/', 'node_modules/', 'public/'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],

  {
    languageOptions: { globals: { ...globals.node } },
    rules: {
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/i18n/*.json'],
              message: 'Read translations through useTranslations()/locales from src/i18n.',
            },
          ],
        },
      ],
    },
  },

  // The i18n module is the only place allowed to import locale files directly.
  { files: ['src/i18n/index.ts'], rules: { 'no-restricted-imports': 'off' } },

  { files: ['**/*.astro'], rules: templateRules },

  // Browser code.
  {
    files: ['src/scripts/**/*.js', '**/*.astro/*.js', '**/*.astro/*.ts'],
    languageOptions: { globals: { ...globals.browser } },
    rules: { 'no-console': ['error', { allow: ['warn', 'error'] }] },
  },
);
