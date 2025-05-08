import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Shared rules that apply to both JS and TS files
const sharedRules = {
  // Error prevention
  'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
  'prefer-const': 'error',
  'no-unused-expressions': 'error',
  eqeqeq: ['error', 'always'],
  'no-var': 'error',
  'no-implicit-coercion': 'error',
  'require-atomic-updates': 'error',
  'no-return-assign': 'error',

  // Code structure
  'no-negated-condition': 'error',
  'no-else-return': 'error',
  'consistent-return': 'error',
  'no-shadow': ['error', {
    builtinGlobals: false,
    hoist: 'functions',
    allow: [],
    ignoreOnInitialization: false
  }],
  'no-nested-ternary': 'error',
  'no-lonely-if': 'error',

  // Style and conventions
  'arrow-body-style': ['error', 'as-needed'],
  curly: ['error', 'all'],
  quotes: ['error', 'single', { avoidEscape: true }],
  semi: ['error', 'always'],
  'space-before-blocks': 'error',
  'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
  'object-curly-spacing': ['error', 'always'],
  'array-bracket-spacing': ['error', 'never'],
  'space-in-parens': ['error', 'never'],
  'comma-spacing': ['error', { before: false, after: true }],
  'eol-last': ['error', 'always'],
  'no-trailing-spaces': 'error',
  'key-spacing': ['error', { beforeColon: false, afterColon: true }],
  'no-multi-spaces': 'error',
  'function-call-argument-newline': ['error', 'consistent'],
  'object-shorthand': ['error', 'always'],
  'quote-props': ['error', 'as-needed'],
  'space-before-function-paren': [
    'error',
    {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    },
  ],
  'prefer-template': 'error',
  'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: false }],

  // Line breaks and whitespace formatting
  'padding-line-between-statements': [
    'error',
    { blankLine: 'always', prev: '*', next: 'return' },
    { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
    { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
    { blankLine: 'always', prev: '*', next: 'block-like' },
    { blankLine: 'always', prev: 'block-like', next: '*' },
    { blankLine: 'always', prev: '*', next: 'function' },
  ],
  'brace-style': ['error', '1tbs', { allowSingleLine: false }],
  'comma-dangle': 'off',
  'array-element-newline': 'off',
  'array-bracket-newline': 'off',
  'object-curly-newline': 'off',
  'object-property-newline': 'off',
  'function-paren-newline': 'off',
  'implicit-arrow-linebreak': 'off',
  'newline-per-chained-call': 'off',
  'operator-linebreak': 'off',
  'max-len': [
    'error',
    {
      code: 120,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignoreComments: true,
      ignorePattern: '^\\s*expect\\(',
    },
  ],

  // Import rules
  'import/order': 'off',
  'import/newline-after-import': ['error', { count: 1 }],
  'import/no-duplicates': [
    'error',
    { 'prefer-inline': false, considerQueryString: true },
  ],
  'import/first': 'error',
  'unused-imports/no-unused-imports': 'error',
  'no-duplicate-imports': 'off',

  // Comments formatting
  'lines-around-comment': 'off',
  'spaced-comment': ['error', 'always', { markers: ['/'] }],
  'multiline-comment-style': 'off',
};

export default [
  js.configs.recommended,
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/*.d.ts', '**/scripts/**'],
  },

  // JavaScript configuration
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      ...sharedRules,
      indent: ['error', 2],
      'no-undef': 'error',
      'no-unused-vars': 'error',
    },
  },

  // TypeScript configuration
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      ...sharedRules,

      // TypeScript-specific indentation (overrides the shared one)
      // '@typescript-eslint/indent': ['error', 2],
      indent: ['error', 2, {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }],

      // TypeScript specific
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-loss-of-precision': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/naming-convention': [
        'error',

        // Default - apply camelCase unless overridden
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },

        // Types, classes, interfaces, enums - PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },

        // Variables - allow multiple formats
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },

        // Allow various formats for enum members (UPPER_CASE, PascalCase, camelCase)
        {
          selector: 'enumMember',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },

        // Type parameters like T, K, V
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          filter: {
            regex: '^([A-Z][a-z]*|[A-Z])$',
            match: true,
          },
        },

        // All properties must use camelCase or UPPER_CASE for constants
        {
          selector: [
            'classProperty',
            'parameterProperty',
            'objectLiteralProperty',
            'typeProperty',
            'property',
          ],
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          // Exception for specific properties from external libraries
          filter: {
            regex: '^(master_node|imported_keys)$',
            match: false
          }
        },

        // Exception for the specific library properties
        {
          selector: [
            'objectLiteralProperty',
            'typeProperty',
            'property',
          ],
          format: null,
          filter: {
            regex: '^(master_node|imported_keys)$',
            match: true
          }
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-namespace': 'error',
    },
  },

  // Test files configuration
  {
    files: ['**/*.test.js', '**/*.test.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      'no-useless-escape': 'off',

      // Style relaxations for test files
      'padding-line-between-statements': 'off',
      'import/no-duplicates': 'off',
      'import/order': 'off',
      'comma-dangle': 'off',
      'max-len': [
        'error',
        {
          code: 150, // More lenient line length for tests
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreComments: true,
          ignorePattern: '^\\s*expect\\(', // Ignore expect statements
        },
      ],
    },
  },
];
