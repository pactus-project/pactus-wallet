# Dependency Updates

This document explains how to update dependencies in the Pactus Wallet project.
Run this process regularly, ideally **after each release**.

## Node.js

Update Node.js to the latest LTS: [nodejs.org](https://nodejs.org/en/download)

When the Node.js version changes, also update the `node-version` in the GitHub
Actions workflows under [`.github/workflows/`](../.github/workflows/) and the
`NODE_VERSION` repository variable used by the deploy workflow.

## npm Packages

```bash
npm outdated                # see what's behind
npx npm-check-updates -u    # bump package.json to latest
npm install                 # install them and update package-lock.json
```

Then build, lint, type-check, and test. Fix anything that breaks:

```bash
npm run build
npm run lint
npm run type-check
npm test
npm run build-storybook
```

Always commit the updated `package-lock.json` together with `package.json`.

## Special Considerations

Some packages need extra care and should **not** be blindly bumped to latest:

- **`@pactus/sdk`** — the wallet core SDK, maintained in
  [pactus-project/js-sdk](https://github.com/pactus-project/js-sdk). Check its
  changelog for breaking API changes before updating. If the wallet needs SDK
  changes, propose them in the js-sdk repository instead of working around
  them here.
- **`next` / `react`** — major Next.js upgrades usually require config and
  code migrations (see the [Next.js upgrade guide](https://nextjs.org/docs/app/guides/upgrading)).
  The build intentionally uses **webpack** (`next build --webpack`), not
  Turbopack, because `next.config.ts` relies on webpack-specific WASM handling
  (`base64-loader` and `copy-webpack-plugin` for `wallet-core.wasm` and
  `argon2.wasm`). Verify that the WASM files still end up in the build output
  (`out/_next/static/`) after any Next.js update.
- **`storybook` and `@storybook/*`** — all Storybook packages must be updated
  together to the same version. Use `npx storybook@latest upgrade` for major
  version bumps and validate with `npm run build-storybook`.
- **`tailwindcss`** — kept on v3. Tailwind v4 uses a new CSS-first
  configuration and requires a dedicated migration of `tailwind.config.js`
  and the global styles.
- **`eslint` and plugins** — the flat config in `eslint.config.mjs` depends on
  several plugins. Before a major ESLint bump, check that every plugin in
  `devDependencies` supports it.
- **`jest` / `ts-jest`** — keep `jest`, `@types/jest`, and `ts-jest` versions
  compatible with each other (see the
  [ts-jest compatibility table](https://kulshekhar.github.io/ts-jest/docs/)).

## GitHub Actions

Check the workflows under [`.github/workflows/`](../.github/workflows/) and
update the action versions (e.g. `actions/checkout`, `actions/setup-node`).

## Open a PR

Commit, push, and open a pull request against `main`:

```bash
git checkout -b chore/update-dependencies
git commit -am "chore(deps): update dependencies"
git push origin HEAD
```

Wait for CI (build, test, lint) to pass before requesting a review.
