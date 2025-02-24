import { createPulumiCommand, notify, runHook } from "~/utils";
import { BeforeDeployPlugin } from "~/plugins";
import { PackagesBuilder } from "./buildPackages/PackagesBuilder";
import { pulumiLoginSelectStack } from "./deploy/pulumiLoginSelectStack";
import { executeDeploy } from "./deploy/executeDeploy";
import { executePreview } from "./deploy/executePreview";
import { executeRefresh } from "~/commands/deploy/executeRefresh";
import { setTimeout } from "node:timers/promises";
import type { CliContext } from "@webiny/cli/types";

export interface IDeployParams {
    _: string[];
    build: boolean;
    deploy: boolean;
    preview: boolean;
    env: string;
    variant: string | undefined;
    region: string | undefined;
    folder: string;
    cwd: string;
    telemetry?: boolean;
}

export const deployCommand = (params: IDeployParams, context: CliContext) => {
    const command = createPulumiCommand({
        name: "deploy",
        createProjectApplicationWorkspace: params.build,
        telemetry: true,
        command: async commandParams => {
            const { inputs, context, projectApplication, pulumi, getDuration } = commandParams;
            const { env, variant, folder, build, deploy } = inputs;

            const hookArgs = { context, env, variant, inputs, projectApplication };

            context.info("Webiny version: %s", context.version);
            console.log();

            // Just so the version stays on the screen for a second, before the process continues.
            await setTimeout(1000);

            if (build) {
                await runHook({
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
            } else {
                context.info("Skipping building of packages.");
            }

            console.log();

            if (!deploy) {
                context.info("Skipping project application deployment.");
                return;
            }

            await runHook({
                hook: BeforeDeployPlugin.type,
                args: hookArgs,
                context
            });

            try {
                await pulumiLoginSelectStack({ inputs, projectApplication, pulumi });
            } catch (ex) {
                context.error(ex.message);
                throw ex;
            }

            console.log();

            // A Pulumi refresh might be executed before the deploy. For example,
            // this is needed if the user run the watch command prior to the deploy.
            await executeRefresh(commandParams);

            if (inputs.preview) {
                await executePreview(commandParams);
            } else {
                await executeDeploy(commandParams);
            }

            console.log();

            await runHook({
                hook: "hook-after-deploy",
                args: hookArgs,
                context
            });

            await notify({
                message: `"${folder}" stack deployed in ${getDuration()}.`,
                timeout: 1
            });
        }
    });

    return command(params, context);
};
