import { type CliContext } from "@webiny/cli/types";

export const setMustRefreshBeforeDeploy = (context: CliContext) => {
    return context.localStorage.set("watch-command-must-refresh-before-deploy", true);
};

export const getMustRefreshBeforeDeploy = (context: CliContext) => {
    return context.localStorage.get("watch-command-must-refresh-before-deploy");
};
