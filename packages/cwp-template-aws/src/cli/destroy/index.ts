import type { CliContext } from "@webiny/cli/types";
import { destroy } from "./destroy";

export interface IDestroyAllPluginDestroyParams {
    [key: string]: any;
}

export interface IDestroyAllPlugin {
    type: "cli-command-deployment-destroy-all";
    name: "cli-command-deployment-destroy-all";
    destroy: (params: IDestroyAllPluginDestroyParams, context: CliContext) => Promise<void>;
}

export const destroyAllCommand: IDestroyAllPlugin = {
    type: "cli-command-deployment-destroy-all",
    name: "cli-command-deployment-destroy-all",
    destroy: (...args) => {
        // @ts-expect-error
        return destroy(...args);
    }
};
