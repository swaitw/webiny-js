import { ProjectApplication } from "@webiny/cli/types";
import chalk from "chalk";
import { IUserCommandInput } from "~/types";

const MATCH_STRING = "the stack is currently locked by";

export interface IPendingOperationsInfoParamsContext {
    projectApplication: Pick<ProjectApplication, "id">;
    commandParams: Pick<IUserCommandInput, "env">;
}

export interface IPendingOperationsInfoParams {
    error: Pick<Error, "message">;
    context: IPendingOperationsInfoParamsContext;
}

export const pendingOperationsInfo = ({ error, context }: IPendingOperationsInfoParams) => {
    const { message } = error;

    const projectApplicationName = context.projectApplication?.id || `PROJECT_APPLICATION`;
    const environmentName = context.commandParams?.env || `ENVIRONMENT_NAME`;

    if (typeof message === "string" && message.includes(MATCH_STRING)) {
        const cmd = `yarn webiny pulumi ${projectApplicationName} --env ${environmentName} -- cancel`;

        const message = [
            `The Pulumi error you've just experienced can occur`,
            `if one of the previous deployments has been interrupted or another deployment`,
            `is already in progress. For development purposes, the quickest way to get`,
            `past this issue is to run the following command: ${chalk.blue(cmd)}.`
        ].join(" ");

        const learnMore = "https://webiny.link/locked-stacks";

        return { message, learnMore };
    }
    return undefined;
};
