import { createModifyFastifyPlugin } from "@webiny/handler";
import type { Context } from "./types";

const execute = async (input?: Context | unknown) => {
    if (!input) {
        return;
    }
    const context = input as Context;
    if (!context.logger?.log?.flush) {
        return;
    }
    // @ts-expect-error
    else if (context.___flushedLogs) {
        return;
    }
    // @ts-expect-error
    context.___flushedLogs = true;

    try {
        await context.logger.log.flush();
    } catch (ex) {
        console.error("Error flushing logs.");
        console.log(ex);
    }
};
export const createLifecycle = () => {
    return createModifyFastifyPlugin(app => {
        app.addHook("onTimeout", async () => {
            execute(app.webiny);
        });

        app.addHook("onResponse", async () => {
            execute(app.webiny);
        });
    });
};
