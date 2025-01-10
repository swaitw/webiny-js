import { DynamoDbLogger } from "~/logger";
import { ILogger, ILoggerStorageOperations } from "~/types";

export interface ICreateMockLoggerParams {
    locale?: string;
    tenant?: string;
    storageOperations: ILoggerStorageOperations;
}

export const createMockLogger = (params: ICreateMockLoggerParams): ILogger => {
    return new DynamoDbLogger({
        getLocale: () => {
            return params.locale || "en-US";
        },
        getTenant: () => {
            return params.tenant || "root";
        },
        options: {
            waitForFlushMs: 500
        },
        onFlush: async items => {
            return await params.storageOperations.insert({
                items
            });
        }
    });
};
