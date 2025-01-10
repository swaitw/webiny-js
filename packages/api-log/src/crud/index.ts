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
    ILoggerStorageOperations,
    ILoggerWithSource
} from "~/types";
import { NotFoundError } from "@webiny/handler-graphql";

export interface ICreateCrudParams {
    storageOperations: ILoggerStorageOperations;
    checkPermission(): Promise<void>;
}

export const createCrud = (params: ICreateCrudParams): ILoggerCrud => {
    const { storageOperations, checkPermission } = params;

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
        }
    };
};
