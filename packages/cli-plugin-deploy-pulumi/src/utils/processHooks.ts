import { Context } from "~/types";
import { GracefulError } from "./GracefulError";

export interface IProcessHooksParams {
    context: Context;
    [key: string]: any;
}

export const processHooks = async (hook: string, { context, ...options }: IProcessHooksParams) => {
    const plugins = context.plugins.byType(hook);

    for (let i = 0; i < plugins.length; i++) {
        try {
            await plugins[i].hook(options, context);
        } catch (err) {
            if (err instanceof GracefulError) {
                throw err;
            }

            err.message = `An error occurred while processing ${context.error.hl(
                plugins[i].name
            )} plugin: ${err.message}`;

            throw err;
        }
    }
};
