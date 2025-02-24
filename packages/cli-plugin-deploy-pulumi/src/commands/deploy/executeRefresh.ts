import { Context, IPulumi, IUserCommandInput } from "~/types";
import { measureDuration } from "~/utils";
import ora from "ora";
import { isCI } from "ci-info";
import { getMustRefreshBeforeDeploy } from "~/utils";
import {
    createEnvConfiguration,
    withEnv,
    withEnvVariant,
    withProjectName,
    withRegion
} from "~/utils/env";

export interface IExecuteRefreshParams {
    inputs: IUserCommandInput;
    context: Context;
    pulumi: Pick<IPulumi, "run">;
}

export const executeRefresh = async ({ inputs, context, pulumi }: IExecuteRefreshParams) => {
    const mustRefreshBeforeDeploy = getMustRefreshBeforeDeploy(context);
    if (!mustRefreshBeforeDeploy) {
        return;
    }

    // We always show deployment logs when doing previews.
    const showDeploymentLogs = isCI || inputs.deploymentLogs;

    const getDeploymentDuration = measureDuration();

    const spinner = ora("Refreshing Pulumi state...");

    try {
        const subprocess = pulumi.run({
            command: ["refresh", "--yes"],
            execa: {
                args: {
                    debug: !!inputs.debug
                },
                env: createEnvConfiguration({
                    configurations: [
                        withRegion(inputs),
                        withEnv(inputs),
                        withEnvVariant(inputs),
                        withProjectName(context)
                    ]
                })
            }
        });

        if (showDeploymentLogs) {
            subprocess.stdout!.pipe(process.stdout);
            subprocess.stderr!.pipe(process.stderr);
            await subprocess;
        } else {
            spinner.start();
            await subprocess;
        }

        const message = `Pulumi state refreshed in ${getDeploymentDuration()}.`;

        if (showDeploymentLogs) {
            context.success(message);
        } else {
            spinner.succeed(message);
        }
    } catch (e) {
        // If the deployment logs were already shown, we don't want to do anything.
        if (showDeploymentLogs) {
            throw e;
        }

        spinner.fail(`Refresh failed. For more details, please check the error logs below.`);
        console.log();
        console.log(e.stderr || e.stdout || e.message);
        throw e;
    }
};
