import nx from '@nx/eslint-plugin';
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...tseslint.config(
    {
      ignores: [
        'eslint.config.mjs',
        'public/**',
        '**/dist/**',
        '**/node_modules/**',
      ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
      plugins: {
        import: importPlugin,
      },
    },
    {
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.jest,
        },
        ecmaVersion: 5,
        sourceType: 'module',
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        'import/no-cycle': 'error',
        'import/order': [
          'error',
          {
            groups: [
              ['builtin', 'external'],
              'internal',
              ['parent', 'sibling'],
              'index',
              'type',
            ],
            pathGroups: [
              { pattern: '@nestjs/**', group: 'external', position: 'before' },
            ],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
        'sort-imports': [
          'error',
          {
            ignoreDeclarationSort: true,
            ignoreMemberSort: false,
          },
        ],
        'import/no-unresolved': 'off',
      },
    },
  ),
];
