import { Context, IUserCommandInput, ProjectApplication } from "~/types";
import { processHooks } from "./processHooks";

export interface IRunHookParamsArgs {
    context: Context;
    env: string;
    variant: string | undefined;
    inputs: IUserCommandInput;
    projectApplication: ProjectApplication | undefined;
    [key: string]: any;
}

export interface IRunHookParams<T extends IRunHookParamsArgs> {
    hook: string;
    skip?: boolean;
    args: T;
    context: Context;
}

export const runHook = async function runHook<T extends IRunHookParamsArgs>({
    hook,
    skip,
    args,
    context
}: IRunHookParams<T>) {
    if (skip) {
        context.info(`Skipped %s hook.`, hook);
    } else {
        context.info(`Running %s hook...`, hook);
        await processHooks(hook, args);
        context.info(`Hook %s completed.`, hook);
    }
};
