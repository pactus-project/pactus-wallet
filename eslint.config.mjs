import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Rule groups for better organization
const errorPreventionRules = {
  // Basic error prevention
  'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
  'prefer-const': 'error',
  'no-unused-expressions': 'error',
  eqeqeq: ['error', 'always'],
  'no-var': 'error',
  curly: ['error', 'all'],
  'no-useless-catch': 'error',
  'no-duplicate-imports': 'error',
  'no-undef': 'error',
  'no-unused-vars': 'error',

  'no-implicit-coercion': 'error',
  'no-negated-condition': 'error',
  'no-else-return': 'error',
  'consistent-return': 'error',
  'no-shadow': ['error', { builtinGlobals: false, hoist: 'functions', allow: [], ignoreOnInitialization: false }],
  'no-return-assign': 'error',
  'require-atomic-updates': 'error',
  'prefer-template': 'error',
  'no-nested-ternary': 'error',
  'no-lonely-if': 'error',
  'padding-line-between-statements': [
    'error',
    { blankLine: 'always', prev: '*', next: 'return' },
    { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
    { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
    { blankLine: 'always', prev: '*', next: 'block-like' },
    { blankLine: 'always', prev: 'block-like', next: '*' },
    { blankLine: 'always', prev: '*', next: 'function' },
  ],

  // Enhanced error prevention
  'no-return-await': 'error',
  'require-await': 'error',
  'no-promise-executor-return': 'error',
  'no-param-reassign': [
    'error',
    {
      props: true,
      ignorePropertyModificationsFor: [
        'state',
        'acc',
        'draft',
        'e',
        'event',
        'ctx',
        'req',
        'res'
      ]
    }
  ],
  'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
  'max-depth': ['error', 4],
  'max-lines-per-function': [
    'error',
    { max: 150, skipBlankLines: true, skipComments: true }
  ],
  complexity: ['error', 10],
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['../*'],
          message: 'Usage of relative parent imports is not allowed. Use absolute imports instead.'
        }
      ],
      paths: [
        {
          name: 'lodash',
          message: 'Import specific methods from lodash instead (e.g., import { map } from "lodash").'
        }
      ]
    }
  ],
  'no-debugger': 'error',
  'no-alert': 'error',
  'no-template-curly-in-string': 'error',
  'default-case': 'error',
  'guard-for-in': 'error',
  'prefer-spread': 'error',
  'prefer-object-spread': 'error',
  'prefer-destructuring': ['error', { array: false, object: true }],
};

const reactRules = {
  // Basic React rules
  'react/react-in-jsx-scope': 'off', // Not needed with modern React
  'react/prop-types': 'off', // Using TypeScript instead
  'react/display-name': 'error',
  'react-hooks/rules-of-hooks': 'error', // Important for hooks correctness
  'react-hooks/exhaustive-deps': 'error', // Critical for avoiding bugs
  'react/jsx-key': 'error',
  'react/self-closing-comp': 'error',
  'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
  'react/jsx-boolean-value': ['error', 'never'],

  // Enhanced React error prevention
  'react/jsx-no-duplicate-props': 'error',
  'react/jsx-no-undef': 'error',
  'react/no-danger': 'error',
  'react/no-children-prop': 'error',
  'react/no-array-index-key': 'error',
  'react/no-unescaped-entities': 'error',
  'react/no-unused-state': 'error',
  'react/no-unused-prop-types': 'error',
  'react/no-multi-comp': ['error', { ignoreStateless: true }],
  'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
  'react/jsx-no-script-url': 'error',
  'react/jsx-no-useless-fragment': 'error',
  'react/jsx-no-bind': [
    'error',
    {
      allowArrowFunctions: true,
      allowFunctions: false,
      allowBind: false
    }
  ],
  'react/forbid-component-props': [
    'error',
    {
      forbid: [
        {
          propName: 'style',
          message: 'Use styled-components or Tailwind classes instead'
        }
      ]
    }
  ],
  'react/function-component-definition': [
    'error',
    {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function'
    }
  ],

  // React/JSX formatting
  'react/jsx-max-props-per-line': ['error', { maximum: { single: 3, multi: 1 } }],
  'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
  'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
  'react/jsx-closing-tag-location': 'error',
  'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],
  'react/jsx-equals-spacing': ['error', 'never'],
  'react/jsx-indent': ['error', 2],
  'react/jsx-indent-props': ['error', 2],
  'react/jsx-tag-spacing': [
    'error',
    {
      closingSlash: 'never',
      beforeSelfClosing: 'always',
      afterOpening: 'never',
      beforeClosing: 'never'
    }
  ],
  'react/jsx-wrap-multilines': [
    'error',
    {
      declaration: 'parens-new-line',
      assignment: 'parens-new-line',
      return: 'parens-new-line',
      arrow: 'parens-new-line',
      condition: 'parens-new-line',
      logical: 'parens-new-line',
      prop: 'parens-new-line'
    }
  ],
  'react/jsx-sort-props': [
    'error',
    {
      callbacksLast: true,
      shorthandFirst: true,
      ignoreCase: true,
      reservedFirst: true
    }
  ],
};

const importRules = {
  'import/order': 'off',
  'unused-imports/no-unused-imports': 'error',
  'import/no-duplicates': [
    'error',
    { 'prefer-inline': false, considerQueryString: true },
  ],
  'import/first': 'off',
  'import/newline-after-import': 'off',
  'import/no-cycle': ['error', { maxDepth: 10 }],
  'import/extensions': [
    'error',
    'never',
    {
      json: 'always',
      css: 'always',
      scss: 'always',
      svg: 'always',
      png: 'always',
      jpg: 'always',
      jpeg: 'always'
    }
  ],
};

const styleRules = {
  quotes: ['error', 'single', { avoidEscape: true }],
  semi: ['error', 'always'],
  'comma-dangle': 'off',
  'arrow-body-style': ['error', 'as-needed'],
  'brace-style': ['error', '1tbs'],
  'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
  'space-before-blocks': 'error',

  // Code formatting
  'max-len': [
    'error',
    {
      code: 120,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignoreComments: true,
      ignorePattern: '^\\s*expect\\('
    }
  ],
  'object-curly-spacing': ['error', 'always'],
  'array-bracket-spacing': ['error', 'never'],
  'space-in-parens': ['error', 'never'],
  'comma-spacing': ['error', { before: false, after: true }],
  'eol-last': ['error', 'always'],
  'no-trailing-spaces': 'error',
  'key-spacing': ['error', { beforeColon: false, afterColon: true }],
  'function-call-argument-newline': ['error', 'consistent'],
  'object-shorthand': ['error', 'always'],
  'quote-props': ['error', 'as-needed'],
  'array-element-newline': 'off',
  'array-bracket-newline': 'off',
  'object-curly-newline': 'off',
  'object-property-newline': 'off',
  'function-paren-newline': 'off',
  'implicit-arrow-linebreak': 'off',
  'newline-per-chained-call': 'off',
  'operator-linebreak': 'off',
  'lines-around-comment': 'off',
  'multiline-comment-style': 'off'
};

const typescriptRules = {
  '@typescript-eslint/explicit-function-return-type': [
    'error',
    {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true,
      allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      allowFunctionsWithoutTypeParameters: true
    }
  ],
  '@typescript-eslint/no-explicit-any': 'error',
  // Use TypeScript's unused vars rule instead of ESLint's
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }
  ],
  '@typescript-eslint/no-empty-function': 'error',
  '@typescript-eslint/naming-convention': [
    'error',
    // Default - apply camelCase unless overridden
    {
      selector: 'default',
      format: ['camelCase'],
      leadingUnderscore: 'allow'
    },
    // Types, classes, interfaces, enums - PascalCase
    {
      selector: 'typeLike',
      format: ['PascalCase']
    },
    // Variables - allow multiple formats
    {
      selector: 'variable',
      format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      leadingUnderscore: 'allow'
    },
    // Functions and methods should be camelCase
    // For React components, allow PascalCase
    {
      selector: ['function', 'method'],
      format: ['camelCase', 'PascalCase'],
      leadingUnderscore: 'allow'
    },
    // Allow various formats for enum members
    {
      selector: 'enumMember',
      format: ['camelCase', 'UPPER_CASE', 'PascalCase']
    },
    // Parameters should be camelCase
    {
      selector: 'parameter',
      format: ['camelCase'],
      leadingUnderscore: 'allow'
    },
    // Type parameters like T, K, V
    {
      selector: 'typeParameter',
      format: ['PascalCase'],
      filter: {
        regex: '^([A-Z][a-z]*|[A-Z])$',
        match: true
      }
    },
    // Properties for standard TypeScript - allow snake_case for compatibility
    {
      selector: [
        'classProperty',
        'objectLiteralProperty',
        'typeProperty',
        'property'
      ],
      format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      leadingUnderscore: 'allow'
    },
    // Allow kebab-case for object literal properties (commonly used in Next.js routes)
    {
      selector: 'objectLiteralProperty',
      format: null,
      filter: {
        regex: '^([a-z][a-z0-9]*-)+[a-z0-9]+$',
        match: true
      }
    },
    // Special cases for React props and state
    {
      selector: 'parameter',
      modifiers: ['destructured'],
      format: ['camelCase'],
      leadingUnderscore: 'allow'
    },
    // React component props interface
    {
      selector: 'interface',
      filter: {
        regex: '.*Props$|.*State$',
        match: true
      },
      format: ['PascalCase']
    },
    // Allow PascalCase for imports
    {
      selector: 'import',
      format: null
    }
  ],
  '@typescript-eslint/ban-ts-comment': [
    'error',
    {
      'ts-ignore': 'allow-with-description'
    }
  ],
  '@typescript-eslint/consistent-type-imports': 'off',
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/no-non-null-assertion': 'error',
};

const nextjsRules = {
  'next/no-img-element': 'error',
  'next/no-html-link-for-pages': 'error',
  'next/no-unwanted-polyfillio': 'error',
  'next/no-sync-scripts': 'error',
  'next/no-page-custom-font': 'error',
  'next/no-css-tags': 'error',
  'next/no-duplicate-head': 'error',
  'next/no-title-in-document-head': 'error',
};

export default [
  js.configs.recommended,

  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/.modules/**',
      '**/public/**',
      '**/dist/**'
    ]
  },

  // JavaScript configuration
  {
    files: ['**/*.js', '**/*.mjs', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin
    },
    rules: {
      ...errorPreventionRules,
      ...reactRules,
      ...importRules,
      ...styleRules
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },

  // TypeScript configuration
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      next: nextPlugin,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin
    },
    rules: {
      ...typescriptRules,
      ...nextjsRules,
      ...importRules
    }
  },

  // Test files configuration
  {
    files: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'react/jsx-no-bind': 'off',
      'react/display-name': 'off',
      'import/no-duplicates': 'off',
      'max-len': [
        'error',
        {
          code: 150,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreComments: true,
          ignorePattern: '^\\s*expect\\('
        }
      ],
      'react/jsx-max-props-per-line': 'off',
      'import/order': 'off',
      'max-lines-per-function': 'off'
    }
  }
];
