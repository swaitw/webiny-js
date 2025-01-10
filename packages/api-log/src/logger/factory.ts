import { createDynamoDbLogger, createStorageOperations, DynamoDbLoggerKeys } from "./dynamodb";
import { create } from "~/db";
import { DynamoDBDocument } from "@webiny/aws-sdk/client-dynamodb";

export interface ILoggerFactoryParams {
    documentClient: DynamoDBDocument;
    getTenant: () => string;
    getLocale: () => string;
}

export const loggerFactory = ({ getTenant, getLocale, documentClient }: ILoggerFactoryParams) => {
    const keys = new DynamoDbLoggerKeys();
    const { entity } = create({
        documentClient
    });

    const storageOperations = createStorageOperations({
        entity,
        keys
    });

    return {
        logger: createDynamoDbLogger({
            onFlush: async items => {
                return await storageOperations.insert({
                    items
                });
            },
            getLocale,
            getTenant
        }),
        storageOperations
    };
};
