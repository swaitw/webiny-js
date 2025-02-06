import { getStackOutput } from "@webiny/cli-plugin-deploy-pulumi/utils";
import open from "open";
import type { CliCommandPlugin } from "@webiny/cli/types";

export const openCommand: CliCommandPlugin = {
    type: "cli-command",
    name: "cli-command-open",
    create({ yargs, context }) {
        yargs.command(
            "open <app>",
            `Quickly open Admin application or public website in your default browser`,
            yargs => {
                yargs.option("env", {
                    describe: `Environment`,
                    type: "string",
                    required: true
                });
                yargs.option("variant", {
                    describe: `Variant`,
                    type: "string",
                    required: false
                });
            },
            async (args: Record<string, any>) => {
                const appName = args.app === "website" ? "public website" : "Admin app";
                context.info(`Opening ${appName}...`);

                let appOutput;
                if (args.app === "website") {
                    appOutput = getStackOutput({
                        folder: "website",
                        env: args.env,
                        variant: args.variant
                    });
                } else {
                    appOutput = getStackOutput({
                        folder: "admin",
                        env: args.env,
                        variant: args.variant
                    });
                }

                if (!appOutput) {
                    throw new Error(
                        `Could not retrieve URL for ${appName}. Please make sure you've deployed the project first.`
                    );
                }

                const { appUrl } = appOutput;

                return new Promise(resolve => {
                    setTimeout(() => {
                        context.success(`Successfully opened ${appName}.`);
                        open(appUrl as string);
                        resolve();
                    }, 1000);
                });
            }
        );
    }
};
