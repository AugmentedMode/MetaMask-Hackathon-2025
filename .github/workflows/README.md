# GitHub CI Workflows

This directory contains GitHub Actions workflows for continuous integration.

## Available Workflows

### 1. CI (`ci.yml`)

General CI workflow that runs on every push to main/master and on pull requests:

- Installs dependencies
- Checks linting (continues even if linting fails)
- Builds the application
- Runs tests (continues even if tests fail)
- Caches build artifacts for faster subsequent builds

### 2. Web3 Agent CI (`web3-agent-ci.yml`)

Specialized CI workflow that focuses on the Web3 Agent component:

- Runs when changes are made to Web3 Agent related files
- Type checks Web3 Agent TypeScript files
- Lints Web3 Agent code
- Ensures the Web3 Agent component builds successfully
- Validates that Web3 Agent files are included in the build output

## Running Locally

To run the same checks locally before pushing your changes:

```bash
# Install dependencies
npm ci

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

## Troubleshooting

If CI is failing and you're not sure why:

1. Check the CI logs in the GitHub Actions tab for detailed error messages
2. Ensure you've run the above commands locally before pushing
3. For Web3 Agent specific issues, focus on the Web3 Agent CI workflow results 