const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const path = require('path');

// Load GTS prettier configuration
let gtsPrettierConfig = {};
try {
  gtsPrettierConfig = require('./node_modules/gts/.prettierrc.json');
} catch (error) {
  console.warn('Could not load GTS Prettier config:', error.message);
}

module.exports = [
  // Ignore patterns
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },

  // Import Prettier config
  prettierConfig,

  // JavaScript files configuration
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['error', gtsPrettierConfig],
      'object-curly-spacing': ['error', 'always'],
    },
  },

  // TypeScript files configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      // Override GTS defaults only where necessary
      'object-curly-spacing': ['error', 'always'],
      'prettier/prettier': ['error', 
        {
          ...gtsPrettierConfig,
          bracketSpacing: true,
        }
      ],
    },
  },

  // Specific rules for test files
  {
    files: ['tests/**/*.ts', 'tests/**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-extraneous-dependencies': ['off'],
    },
  },
];
