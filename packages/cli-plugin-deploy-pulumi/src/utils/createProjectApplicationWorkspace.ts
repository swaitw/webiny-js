import path from "path";
import util from "util";
import ncpBase from "ncp";
import { replaceInPath } from "replace-in-path";
// @ts-expect-error
import { createProjectApplicationWorkspace as baseCreateProjectApplicationWorkspace } from "@webiny/cli/utils";
import { IUserCommandInput, ProjectApplication } from "~/types";

const ncp = util.promisify(ncpBase.ncp);

export interface ICreateProjectApplicationWorkspaceParams {
    projectApplication: ProjectApplication;
    inputs: IUserCommandInput;
}

export interface ICreateProjectApplicationWorkspaceCallable {
    (params: ICreateProjectApplicationWorkspaceParams): Promise<void>;
}

export const createProjectApplicationWorkspace: ICreateProjectApplicationWorkspaceCallable =
    async ({ projectApplication, inputs }) => {
        await baseCreateProjectApplicationWorkspace(projectApplication);

        // Copy Pulumi-related files.
        await ncp(path.join(__dirname, "workspaceTemplate"), projectApplication.paths.workspace);

        // Wait a bit and make sure the files are ready to have its content replaced.
        await new Promise(resolve => setTimeout(resolve, 10));

        const variant = !inputs.variant || inputs.variant === "undefined" ? "" : inputs.variant;

        replaceInPath(path.join(projectApplication.paths.workspace, "/**/*.{ts,js,yaml}"), [
            { find: "{PROJECT_ID}", replaceWith: projectApplication.id },
            { find: "{PROJECT_DESCRIPTION}", replaceWith: projectApplication.description },
            { find: "{DEPLOY_ENV}", replaceWith: inputs.env },
            { find: "{DEPLOY_VARIANT}", replaceWith: variant }
        ]);
    };
