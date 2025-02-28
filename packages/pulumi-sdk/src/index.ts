import os from "os";
import execa from "execa";
import * as path from "path";
import { merge, kebabCase, set } from "lodash";
import downloadBinaries from "./downloadBinaries";

type Command = string | string[];
type PulumiArgs = { [key: string]: string | boolean };
type ExecaArgs = { [key: string]: any };

type Options = {
    args?: PulumiArgs;
    execa?: ExecaArgs;
    beforePulumiInstall?: () => any;
    afterPulumiInstall?: () => any;

    // A folder into which the Pulumi CLI, along with all of its meta data and config files, will be set up.
    // It's recommended this folder is not checked in into a code repository, since the Pulumi CLI can store
    // sensitive information here, for example - user's Pulumi Service credentials.
    pulumiFolder?: string;
};

type RunArgs = {
    command: Command;
    args?: PulumiArgs;
    execa?: ExecaArgs;
    beforePulumiInstall?: () => any;
    afterPulumiInstall?: () => any;
};

type InstallArgs = {
    beforePulumiInstall?: () => any;
    afterPulumiInstall?: () => any;
};

export const FLAG_NON_INTERACTIVE = "--non-interactive";

export class Pulumi {
    options: Options;
    pulumiFolder: string;
    pulumiDownloadFolder: string;
    pulumiBinaryPath: string;
    constructor(options: Options = {}) {
        this.options = options;

        this.pulumiDownloadFolder = path.join(
            options.pulumiFolder || process.cwd(),
            "pulumi-cli",
            os.platform()
        );

        this.pulumiFolder = path.join(this.pulumiDownloadFolder, "pulumi");
        this.pulumiBinaryPath = path.join(this.pulumiFolder, "pulumi");
    }

    run(rawArgs: RunArgs) {
        const args = merge({}, this.options, rawArgs);

        if (!Array.isArray(args.command)) {
            args.command = [args.command];
        }

        // 1. Prepare Pulumi args.
        const finalArgs = [];
        for (const key in args.args) {
            const value = args.args[key];
            if (!value) {
                continue;
            }

            if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                    finalArgs.push(`--${kebabCase(key)}`, value[i]);
                }
                continue;
            }

            if (typeof value === "boolean") {
                finalArgs.push(`--${kebabCase(key)}`);
                continue;
            }

            finalArgs.push(`--${kebabCase(key)}`, value);
        }

        // Prepare execa args.
        set(args.execa, "env.PULUMI_SKIP_UPDATE_CHECK", "true");
        set(args.execa, "env.PULUMI_HOME", this.pulumiFolder);

        const execaArgs = {
            ...args.execa,
            env: {
                ...(args.execa.env || {}),
                /**
                 * Due to an issue with Pulumi https://github.com/pulumi/pulumi/issues/8374, and even though this
                 * commit suggests it should already work like that https://github.com/pulumi/pulumi/commit/c878916901a997a9c0ffcbed23560e19e224a6f1,
                 * we need to specify the exact location of our Pulumi binaries, using the PATH environment variable, so it can correctly resolve
                 * plugins necessary for custom resources and dynamic providers to work.
                 */
                PATH: `${process.env.PATH};${this.pulumiFolder}`
            }
        };

        return execa(
            this.pulumiBinaryPath,
            [...args.command, ...finalArgs, FLAG_NON_INTERACTIVE],
            execaArgs
        );
    }

    async install(rawArgs?: InstallArgs): Promise<boolean> {
        const args = merge({}, this.options, rawArgs);

        const installed = await downloadBinaries(
            this.pulumiDownloadFolder,
            args.beforePulumiInstall,
            args.afterPulumiInstall
        );

        if (installed) {
            const { version } = require("@pulumi/aws/package.json");
            await execa(this.pulumiBinaryPath, ["plugin", "install", "resource", "aws", version], {
                stdio: "inherit",
                env: {
                    PULUMI_HOME: this.pulumiFolder,
                    PULUMI_SKIP_UPDATE_CHECK: "true"
                }
            });
        }

        return installed;
    }
}
