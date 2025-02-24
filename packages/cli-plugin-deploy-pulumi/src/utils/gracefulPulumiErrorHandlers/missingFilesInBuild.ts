import { red } from "chalk";

const MATCH_STRING = "failed to compute archive hash for";

export interface IMissingFilesInBuildParams {
    error: Pick<Error, "message">;
}

export const missingFilesInBuild = ({ error }: IMissingFilesInBuildParams) => {
    const { message } = error;

    if (typeof message === "string" && message.includes(MATCH_STRING)) {
        const cmd = red(`yarn webiny build {APP_NAME} --env {ENVIRONMENT_NAME}`);
        return [
            `Looks like the deployment failed because Pulumi could not retrieve the built code.`,
            `Please try again, or, alternatively, try building the project application you're`,
            `trying to deploy by running ${cmd}.`
        ].join(" ");
    }
    return undefined;
};
