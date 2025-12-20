# Deployment

This document outlines the deployment process for the Pactus Wallet,
covering both development and production environments.

## Development Deploy

Updating the `main` branch of this repository automatically updates the development website that is accessible at:
[https://wallet-beta.pactus.org](https://wallet-beta.pactus.org).
This environment serves as a testing ground for new features and improvements before they reach production.
The development website is not intended for production use and may change frequently.
Once features have been thoroughly tested and stabilized in the development environment, we can initiate the production deployment process.

## Production Deployment

The production website is accessible at
[https://wallet.pactus.org](https://wallet.pactus.org) and will only be updated through a formal release process using git tags.
To ensure a smooth and reliable release, it is essential to follow these key steps.
Please carefully follow the instructions provided below:

### 1. Preparing Your Environment

Before proceeding with the release process,
ensure that your `origin` remote is set to `git@github.com:pactus-project/pactus-wallet.git` and not your local fork.

```bash
git remote -vv
```

Also, make sure that you have set up
[GPG for your GitHub account](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account).

### 2. Fetch the Latest Code

Ensure that your local repository is up-to-date with the Pactus-Wallet main repository:

```bash
git checkout main
git pull
```
### 3. Set Environment Variables

Create environment variables for the release version, which will be used in subsequent commands throughout this document.
Keep your terminal open for further steps.

```bash
PRV_VER="1.1.0"
CUR_VER="1.2.0"
NEXT_VER="1.3.0"
BASE_BRANCH="main"
TAG_NAME="v${CUR_VER}"
TAG_MSG="Version ${CUR_VER}"
```

### 4. Update Changelog

Use [Commitizen](https://github.com/commitizen-tools/commitizen) to update the CHANGELOG. Execute the following command:

```bash
cz changelog --incremental --unreleased-version ${TAG_NAME}
perl -i -pe "s/## v${CUR_VER} /## [${CUR_VER}](https:\/\/github.com\/pactus-project\/pactus-wallet\/compare\/v${PRV_VER}...v${CUR_VER}) /g" CHANGELOG.md
perl -i -pe "s/\(#([0-9]+)\)/([#\1](https:\/\/github.com\/pactus-project\/pactus-wallet\/pull\/\1))/g" CHANGELOG.md
```

Occasionally, you may need to make manual updates to the [CHANGELOG](../CHANGELOG.md).

### 5. Create a Release PR

Generate a new PR against the base branch.
It's better to use [GitHub CLI](https://github.com/cli/cli/) to create the PR, but manual creation is also an option.

```bash
git checkout -b releasing_${CUR_VER}
git commit -a -m "chore(release): releasing version ${CUR_VER}"
git push origin HEAD
gh pr create --title "chore(release): releasing version ${CUR_VER}" --body "Releasing version ${CUR_VER}" --base ${BASE_BRANCH}
```

Wait for the PR to be approved and merged into the main branch.

### 6. Tagging the Release

Create a Git tag and sign it using your [GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification) with the following commands:

```bash
git checkout ${BASE_BRANCH}
git pull
git tag -s -a ${TAG_NAME} -m "${TAG_MSG}"
```

Inspect the tag information:

```bash
git show ${TAG_NAME}
```

### 7. Push the Tag

Now, push the tag to the repository:

```bash
git push origin ${TAG_NAME}
```

This will automatically deploy production environment.

### 8. Bump the Version

Update all version references in the codebase for the next development cycle:

1. Update version in all `package.json` files:
   - [apps/web/package.json](../apps/web/package.json)
   - [packages/wallet/package.json](../packages/wallet/package.json)

2. Update the version references in this document (Step 3)

Create a new PR for the version bump:

```bash
git checkout -b bumping_${NEXT_VER}
git commit -a -m "chore(version): bumping version to ${NEXT_VER}"
git push origin HEAD
gh pr create --title "chore(version): bumping version to ${NEXT_VER}" --body "Bumping version to ${NEXT_VER}" --base ${BASE_BRANCH}
```

Wait for the PR to be approved and merged into the main branch.

### 9. Celebrate 🎉

After verifying the release:
- Confirm all tests pass in production
- Verify the website is functioning correctly
- Update any related documentation
- Consider updating dependencies (see [Update Dependencies](./update-dependencies.md))

Then celebrate your successful release! Consider announcing the new version to relevant channels and updating any related project status pages.
