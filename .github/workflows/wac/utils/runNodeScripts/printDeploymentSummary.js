// This script can only be run if we previously checked out the project and installed all dependencies.
const { getStackOutput } = require("@webiny/cli-plugin-deploy-pulumi/utils");

const args = process.argv.slice(2); // Removes the first two elements
const [cwd] = args;

const adminStackOutput = getStackOutput({
    folder: "apps/admin",
    env: "dev",
    cwd
});

const websiteStackOutput = getStackOutput({
    folder: "apps/website",
    env: "dev",
    cwd
});

console.log(`### Deployment Summary
| App | URL |
|-|----|
| Admin Area | [${adminStackOutput.appUrl}](${adminStackOutput.appUrl}) |
| Website | [${websiteStackOutput.appUrl}](${websiteStackOutput.appUrl}) |
`);
