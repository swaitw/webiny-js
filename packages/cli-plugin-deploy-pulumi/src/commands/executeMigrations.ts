import { Context } from "~/types";
import { LambdaClient } from "@webiny/aws-sdk/client-lambda";
import { getStackOutput } from "~/utils";
import {
    CliMigrationRunReporter,
    InteractiveCliStatusReporter,
    LogReporter,
    MigrationRunner,
    NonInteractiveCliStatusReporter
} from "@webiny/data-migration/cli";

export interface IExecuteMigrationsParams {
    env: string;
    variant: string | undefined;
    pattern?: string;
    force?: boolean;
}

export const executeMigrationsCommand = async (
    params: IExecuteMigrationsParams,
    context: Context
) => {
    const apiOutput = getStackOutput({
        folder: "apps/api",
        env: params.env,
        variant: params.variant
    });

    context.info("Executing data migration Lambda function...");

    try {
        const lambdaClient = new LambdaClient({
            region: apiOutput.region
        });

        const functionName = apiOutput["migrationLambdaArn"];

        const logReporter = new LogReporter(functionName);
        const statusReporter =
            !process.stdout.isTTY || "CI" in process.env
                ? new NonInteractiveCliStatusReporter(logReporter)
                : new InteractiveCliStatusReporter(logReporter);

        const runner = MigrationRunner.create({
            lambdaClient,
            functionName,
            statusReporter
        });

        const result = await runner.runMigration({
            version: process.env.WEBINY_VERSION || context.version,
            pattern: params.pattern,
            force: params.force
        });

        if (result) {
            const reporter = new CliMigrationRunReporter(logReporter, context);
            await reporter.report(result);
        }
    } catch (e) {
        context.error(`An error occurred while trying to execute data migration Lambda function!`);
        console.log(e);
    }
};
