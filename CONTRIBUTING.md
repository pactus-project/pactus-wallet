# Contributing

Thank you for considering contributing to the Pactus-Wallet project!
Please read these guidelines before submitting a pull request or opening an issue.

## Before You Contribute

1. **Understand the Project**: Familiarize yourself with the project goals and architecture
2. **Check Existing Issues**: See if there's already an issue for what you want to work on
3. **Discuss Major Changes**: For significant changes, open an issue first to discuss with maintainers

## Code Guidelines

* Follow clean code principles and TypeScript best practices
* Maintain type safety throughout the codebase
* Write comprehensive tests for new code or changes
* Ensure all tests pass before submitting a pull request
* Maintain consistent code style using ESLint and Prettier

## Project Structure Best Practices

- Keep related code in the appropriate package
- Share common functionality through packages
- Include comprehensive tests for all code
- Document components and APIs using JSDoc
- Follow the established coding style and conventions

## Commit Guidelines

We use Conventional Commits format for commit messages and PR titles. Follow these rules:

### Commit Types

| Type     | Description                                      |
| -------- | ------------------------------------------------ |
| fix      | A bug fix                                        |
| feat     | A new feature                                    |
| docs     | Documentation changes                            |
| test     | Adding or correcting tests                       |
| build    | Build system or dependency changes               |
| ci       | CI configuration changes                         |
| perf     | Performance improvements                         |
| refactor | Code changes that don't fix bugs or add features |
| style    | Formatting, white-space, etc.                    |
| chore    | Other changes not modifying src/test files       |

### Commit Scope

Specify which part of the code is affected (e.g., `wallet`, `web`, `api`).
Multiple scopes can be used if changes impact several areas (e.g., `(wallet, api)`).

### Commit Message Format

* Keep under 50 characters
* Start with lowercase letter
* No ending punctuation
* Use imperative mood (e.g., "fix bug" not "fixed bug")

### Examples:

* Correct ✅: "feat(wallet): add support for multi-signature transactions"
* Correct ✅: "fix(api): resolve incorrect balance calculation"
* Correct ✅: "docs(readme): update installation instructions"
* Correct ✅: "refactor(wallet, web): simplify transaction validation logic"
* Correct ✅: "chore(deps): update dependencies to latest versions"
* Incorrect ❌: "Fixed bug in wallet" (not imperative)
* Incorrect ❌: "feat: added new API endpoint." (past tense, extra punctuation)
* Incorrect ❌: "chore: Update readme (start with uppercase, not imperative)

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our code guidelines
4. Ensure tests pass: `yarn test`
5. Commit your changes using conventional commit format
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Review Process

Your PR will go through these checks:

1. Dependency installation verification
2. Code formatting check
3. TypeScript compilation
4. Linting with ESLint
5. Test execution
6. Final maintainer review

### After Submission

* **If Approved**: Your PR will be merged into the main branch
* **If Changes Requested**: Address the feedback and update your PR

### Reporting Issues

When reporting bugs, include:

* Detailed reproduction steps
* Environment information (OS, Node.js version, etc.)
* Screenshots if applicable
* Suggested fixes if possible

### Code of Conduct

This project has adapted the
[Contributor Covenant, version 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)
to ensure that our community is welcoming and inclusive for all.
Please read it before contributing to the project.

---

Thank you for your contributions to the Pactus Wallet!
