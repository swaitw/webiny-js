import type yargs from "yargs";
import type { Context } from "~/types";
import { executeSetPrimaryVariantCommand } from "./primaryVariant/executeSetPrimaryVariantCommand";
import { validateVariantName } from "~/utils";

export interface IPrimaryVariantCommand {
    yargs: typeof yargs;
    context: Context;
}

const getStringOrUndefined = (value: unknown): string | undefined => {
    return typeof value === "string" && !!value ? value : undefined;
};

/**
 * Command to set a primary variant does not require a region because it is already contained inside the stack output.
 */
export const attachPrimaryVariantCommands = (params: IPrimaryVariantCommand): void => {
    const { yargs, context } = params;

    yargs.command(
        "set-primary-variant",
        `Set a deployed system as primary variant.`,
        () => {
            yargs.example("$0 set-primary-variant --env=dev --primary=blue --secondary=green", "");
            yargs.example("$0 set-primary-variant --env=dev --primary=green --secondary=green", "");

            yargs.option("env", {
                describe: `Environment`,
                type: "string",
                required: true
            });
            yargs.option("confirm", {
                describe: "Confirm deployment",
                type: "boolean",
                required: false
            });
            yargs
                .option("primary", {
                    describe: `Primary variant`,
                    type: "string",
                    required: true
                })
                .check(args => {
                    validateVariantName({
                        variant: args.primary
                    });
                    return true;
                });
            yargs
                .option("secondary", {
                    describe: `Secondary variant`,
                    type: "string",
                    required: true
                })
                .check(args => {
                    validateVariantName({
                        variant: args.secondary
                    });
                    return true;
                });
        },
        async argv => {
            return executeSetPrimaryVariantCommand(
                {
                    primary: getStringOrUndefined(argv.primary),
                    secondary: getStringOrUndefined(argv.secondary),
                    env: argv.env as string,
                    confirm: argv.confirm === true || argv.confirm === "true"
                },
                context
            );
        }
    );
};
