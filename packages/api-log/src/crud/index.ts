import {
    Context,
    ILoggerCrud,
    ILoggerCrudDeleteLogParams,
    ILoggerCrudDeleteLogResponse,
    ILoggerCrudDeleteLogsParams,
    ILoggerCrudGetLogResponse,
    ILoggerCrudGetLogsParams,
    ILoggerCrudListLogsParams,
    ILoggerCrudListLogsResponse,
    ILoggerLog,
    ILoggerPruneLogsResponse,
    ILoggerStorageOperations,
    ILoggerWithSource,
    IPruneLogsStoredValue
} from "~/types";
import { NotFoundError } from "@webiny/handler-graphql";
import { WebinyError } from "@webiny/error";
import { PRUNE_LOGS_TASK } from "~/tasks/constants";
import { createStoreKey } from "~/utils/storeKey";

export interface ICreateCrudParams {
    getContext: () => Pick<Context, "tasks" | "db" | "security">;
    storageOperations: ILoggerStorageOperations;
    checkPermission(): Promise<void>;
}

export const createCrud = (params: ICreateCrudParams): ILoggerCrud => {
    const { storageOperations, checkPermission, getContext } = params;

    return {
        async getLog(params: ILoggerCrudGetLogsParams): Promise<ILoggerCrudGetLogResponse> {
            await checkPermission();
            const item = await storageOperations.getLog(params);
            if (!item) {
                throw new NotFoundError();
            }
            return {
                item
            };
        },
        async deleteLog(params: ILoggerCrudDeleteLogParams): Promise<ILoggerCrudDeleteLogResponse> {
            await checkPermission();
            const item = await storageOperations.deleteLog({
                ...params
            });
            if (!item) {
                throw new NotFoundError();
            }
            return {
                item
            };
        },
        async deleteLogs(params: ILoggerCrudDeleteLogsParams): Promise<ILoggerLog[]> {
            await checkPermission();
            return storageOperations.deleteLogs(params);
        },
        async listLogs(params: ILoggerCrudListLogsParams): Promise<ILoggerCrudListLogsResponse> {
            await checkPermission();
            const { items, meta } = await storageOperations.listLogs(params);
            return {
                items,
                meta
            };
        },
        withSource(this: Context["logger"], source: string): ILoggerWithSource {
            return {
                info: (data, options) => {
                    return this.log.info(source, data, options);
                },
                notice: (data, options) => {
                    return this.log.notice(source, data, options);
                },
                debug: (data, options) => {
                    return this.log.debug(source, data, options);
                },
                warn: (data, options) => {
                    return this.log.warn(source, data, options);
                },
                error: (data, options) => {
                    return this.log.error(source, data, options);
                },
                flush: () => {
                    return this.log.flush();
                }
            };
        },
        async pruneLogs(): Promise<ILoggerPruneLogsResponse> {
            await checkPermission();

            const context = getContext();

            const key = createStoreKey();

            const alreadyPruning = await context.db.store.getValue<IPruneLogsStoredValue>(key);

            if (alreadyPruning?.data?.taskId) {
                throw new WebinyError({
                    message: "Already pruning logs.",
                    code: "ALREADY_PRUNING_LOGS",
                    data: {
                        identity: alreadyPruning.data.identity,
                        taskId: alreadyPruning.data.taskId
                    }
                });
            }

            const task = await context.tasks.trigger({
                definition: PRUNE_LOGS_TASK,
                name: "Prune all Webiny logs"
            });

            const identity = context.security.getIdentity();

            await context.db.store.storeValue<IPruneLogsStoredValue>(key, {
                identity: {
                    id: identity.id,
                    displayName: identity.displayName,
                    type: identity.type
                },
                taskId: task.id
            });

            return {
                task
            };
        }
    };
};
