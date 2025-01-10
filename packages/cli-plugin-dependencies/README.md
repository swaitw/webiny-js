# @webiny/cli-plugin-dependencies

[![](https://img.shields.io/npm/dw/@webiny/cli-plugin-dependencies.svg)](https://www.npmjs.com/package/@webiny/cli-plugin-dependencies)
[![](https://img.shields.io/npm/v/@webiny/cli-plugin-dependencies.svg)](https://www.npmjs.com/package/@webiny/cli-plugin-dependencies)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A plugin for @webiny/cli that provides dependency check capabilities.
Package is internal, do not use it in user projects.


## Usage

A command used to sync all dependencies across all packages and store the data in `@webiny/cli/files/` directory.
It should be run after each dependency update.
```bash
yarn webiny sync-dependencies
```

A command used to verify that all generated files are in sync with the current dependencies. This command is used in the CI/CI pipeline.
```bash
yarn webiny verify-dependencies
```
