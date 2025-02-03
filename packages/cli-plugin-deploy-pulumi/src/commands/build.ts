import { Context } from "~/types";
import { createPulumiCommand, runHook } from "~/utils";
import { PackagesBuilder } from "./buildPackages/PackagesBuilder";

export interface IBuildParams {
    _: string[];
    folder: string;
    env: string;
    variant: string | undefined;
    region: string | undefined;
    cwd: string;
}

export const buildCommand = (params: IBuildParams, context: Context) => {
    const command = createPulumiCommand({
        name: "build",
        createProjectApplicationWorkspace: true,
        command: async ({ inputs, context, projectApplication }) => {
            const { env, variant } = inputs;

            const hookArgs = { context, env, variant, inputs, projectApplication };

            await runHook<typeof hookArgs>({
                hook: "hook-before-build",
                args: hookArgs,
                context
            });

            console.log();

            const builder = new PackagesBuilder({
                packages: projectApplication.packages,
                inputs,
                context
            });

            await builder.build();

            console.log();

            await runHook({
                hook: "hook-after-build",
                args: hookArgs,
                context
            });
        }
    });

    return command(params, context);
};
