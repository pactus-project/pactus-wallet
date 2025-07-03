# Update Dependencies

This document provides guidelines for updating dependencies in the Pactus Wallet project.

## Project Structure

The Pactus Wallet is a monorepo with multiple packages:

- Root project
- `packages/wallet` - Core wallet functionality
- `apps/web` - Web application

Each package has its own `package.json` file with dependencies.

## Update Process

### 1. Regular Updates

For regular dependency updates, follow these steps:

```bash
# Navigate to project root
cd pactus-wallet

# Check outdated packages
yarn outdated

# Update a specific package
yarn upgrade [package-name]@[version]

# Update all packages to their latest version according to semver
yarn upgrade
```

### 2. Workspace-specific Updates

To update dependencies for a specific workspace:

```bash
# For the web app
cd apps/web
yarn outdated
yarn upgrade [package-name]@[version]

# For the wallet package
cd packages/wallet
yarn outdated
yarn upgrade [package-name]@[version]
```

### 3. Managing Resolutions

The root `package.json` contains resolutions that enforce specific versions across all workspaces. Update these when you need to ensure consistency:

```json
"resolutions": {
  "eslint": "^9.0.0",
  "vite": "^6.0.0",
  "webpack": "^5.1.0"
  // other resolutions...
}
```

### 4. Major Version Updates

For major version updates:

1. Check the package's migration guide or changelog
2. Update the dependency in the relevant package.json
3. Make necessary code changes to accommodate breaking changes
4. Run tests to ensure everything works correctly

```bash
# Update to a specific major version
yarn upgrade [package-name]@[major-version]

# Run tests to verify
yarn test
```

### 5. Testing After Updates

Always test thoroughly after updating dependencies:

```bash
# Build the project
yarn build

# Run tests
yarn test

# Type checking
yarn type-check

# Linting
yarn lint
```

### 6. Updating React and Next.js

The project uses React 19 and Next.js 15. When updating these core dependencies:

1. Check the official migration guides
2. Update the versions in `apps/web/package.json`
3. Update any related packages (like React DOM)
4. Follow the migration steps from the official documentation
5. Test thoroughly

### 7. Updating TypeScript

When updating TypeScript:

1. Update the version in the root `package.json` and workspace package.json files
2. Run type checking to identify any new type errors
3. Fix any type issues before committing

```bash
yarn upgrade typescript@[version]
yarn type-check
```

## Best Practices

1. **Update incrementally**: Prefer updating packages one at a time rather than all at once
2. **Create a branch**: Always create a dedicated branch for dependency updates
3. **Commit frequently**: Make atomic commits for each dependency update
4. **Document breaking changes**: Note any significant changes in the PR description
5. **Update lockfile**: Always commit the updated `yarn.lock` file

## Troubleshooting

If you encounter issues after updating dependencies:

1. Check for peer dependency conflicts
2. Review the package's GitHub issues or changelog
3. Try removing `node_modules` and reinstalling:

```bash
rm -rf node_modules
yarn install
```

4. If a specific update causes problems, roll back to the previous version:

```bash
yarn upgrade [package-name]@[previous-version]
```
