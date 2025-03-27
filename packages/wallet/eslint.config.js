import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default [
  // Ignore patterns
  {
    ignores: ['node_modules/**', 'dist/**']
  },
  
  // Import Prettier config
  prettierConfig,
  
  // Base configuration for all files
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'prettier': prettierPlugin,
      'import': importPlugin
    },
    rules: {
      // Common rules
      'no-underscore-dangle': 'off',
      'no-plusplus': 'off',
      'class-method-use-this': 'off',
      'eqeqeq': ['error', 'smart'],
      'complexity': 'error',
      'no-empty': ['error'],
      'no-restricted-globals': 'error',
      'no-param-reassign': 'off',
      'no-prototype-builtins': 'off',
      
      // Style rules
      'array-bracket-spacing': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'max-classes-per-file': ['error', 10],
      'radix': 'off',
      'no-return-assign': 'off',
      'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
      'no-console': [
        'warn',
        {
          allow: ['debug', 'error', 'info']
        }
      ],
      
      // TypeScript rules
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': ['error', { 
        ignoreRestArgs: true 
      }],
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'enumMember',
          format: ['UPPER_CASE', 'PascalCase']
        }
      ],
      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
      
      // Prettier rules
      'prettier/prettier': 'error'
    }
  },
  
  // Specific rules for test files
  {
    files: ['tests/**/*.ts', 'tests/**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-extraneous-dependencies': ['off']
    }
  }
]; 