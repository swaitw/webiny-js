import type { CliContext, Plugin } from "@webiny/cli/types";
import { deploy } from "./deploy";

export interface IDeployAllPluginDeployParams {
    [key: string]: any;
}

export interface IDeployAllPlugin extends Plugin {
    type: "cli-command-deployment-deploy-all";
    name: "cli-command-deployment-deploy-all";
    deploy: (params: IDeployAllPluginDeployParams, context: CliContext) => Promise<void>;
}

export const deployAllCommand: IDeployAllPlugin = {
    type: "cli-command-deployment-deploy-all",
    name: "cli-command-deployment-deploy-all",
    deploy: (...args) => {
        // @ts-expect-error
        return deploy(...args);
    }
};
