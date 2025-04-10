import globals from 'globals';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default [
  // Apply recommended ESLint rules
  js.configs.recommended,
  
  // Apply Prettier rules
  prettierConfig,
  
  // Apply TypeScript rules
  ...tseslint.configs.recommended,
  
  // Define global configuration
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    
    plugins: {
      prettier: prettierPlugin
    },
    
    rules: {
      'prettier/prettier': 'error',
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }]
    },
    
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/out/**',
      '**/.modules/**',
      '**/public/**'
    ]
  },
  
  // JavaScript specific rules
  {
    files: ['**/*.js', '**/*.mjs'],
    rules: {
      'prettier/prettier': ['error']
    }
  },
  
  // TypeScript specific rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'prettier/prettier': ['error'],
      '@typescript-eslint/no-unused-vars': ['error']
    }
  }
]; 