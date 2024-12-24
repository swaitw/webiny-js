#!/usr/bin/env node
"use strict";

const chalk = require("chalk");
const execa = require("execa");
const semver = require("semver");
const currentNodeVersion = process.versions.node;

(async () => {
    if (!semver.satisfies(currentNodeVersion, ">=20")) {
        console.error(
            chalk.red(
                [
                    `You are running Node.js ${currentNodeVersion}, but Webiny requires version >=20.`,
                    `Please switch to one of the required versions and try again.`,
                    `For more information, please visit https://www.webiny.com/docs/get-started/install-webiny#prerequisites.`
                ].join(" ")
            )
        );
        process.exit(1);
    }

    try {
        const { stdout } = await execa("yarn", ["--version"]);
        /**
         * TODO In 5.43.0 put >=4 as yarn version.
         * This is because of the existing yarn version (before doing the webiny upgrade) is v3.x.x.
         * When the upgrade is done (5.42.0), we can safely put to >=4.
         */
        const satisfiesYarnVersion = ">=3";
        if (!semver.satisfies(stdout, satisfiesYarnVersion)) {
            console.error(chalk.red(`"@webiny/cli" requires yarn 4!`));
            process.exit(1);
        }
    } catch (err) {
        console.error(chalk.red(`"@webiny/cli" requires yarn 4!`));
        console.log(
            `Run ${chalk.blue("yarn set version 4.5.3")} to install a compatible version of yarn.`
        );
        process.exit(1);
    }

    require("./cli");
})();
