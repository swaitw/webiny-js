import { Entity } from "@webiny/db-dynamodb/toolbox";
import {
    ILoggerCrudDeleteLogParams,
    ILoggerCrudDeleteLogsParams,
    ILoggerCrudGetLogsParams,
    ILoggerCrudListLogsParams,
    ILoggerCrudListLogsResponse,
    ILoggerCrudListSort,
    ILoggerLog,
    ILoggerStorageOperations,
    ILoggerStorageOperationsInsertParams,
    LogType
} from "~/types";
import { DynamoDbLoggerKeys } from "./DynamoDbLoggerKeys";
import {
    batchReadAll,
    batchWriteAll,
    cleanupItem,
    getClean,
    queryPerPageClean
} from "@webiny/db-dynamodb";
import { GenericRecord } from "@webiny/api/types";
import { compress, decompress } from "@webiny/utils/compression/gzip";
import { convertAfterToStartKey, convertLastEvaluatedKeyToAfterKey } from "./convertKeys";

const TO_STORAGE_ENCODING = "base64";
const FROM_STORAGE_ENCODING = "utf8";

export interface IDynamoDbStorageOperationsParams {
    entity: Entity;
    keys: DynamoDbLoggerKeys;
}

interface ICreateQueryParamsInput {
    tenant: string | undefined;
    source: string | undefined;
    type: LogType | undefined;
    after: string | undefined;
    sort: ILoggerCrudListSort[] | undefined;
}

interface ICreateQueryParamsResult {
    index: string | undefined;
    partitionKey: string;
    reverse: boolean;
    startKey: GenericRecord | undefined;
}

interface ILoggerLogDb extends ILoggerLog {
    data: string;
}

export class DynamoDbStorageOperations implements ILoggerStorageOperations {
    private readonly entity: Entity;
    private readonly keys: DynamoDbLoggerKeys;

    public constructor(params: IDynamoDbStorageOperationsParams) {
        this.entity = params.entity;
        this.keys = params.keys;
    }

    public async insert(params: ILoggerStorageOperationsInsertParams): Promise<ILoggerLog[]> {
        const compressed = await Promise.all(
            params.items.map(async item => {
                return {
                    ...item,
                    data: await this.compress(item.data)
                };
            })
        );
        const items = compressed.map(item => {
            return this.entity.putBatch({
                ...item,
                ...this.keys.create(item)
            });
        });
        try {
            await batchWriteAll({
                items,
                table: this.entity.table
            });
            return params.items;
        } catch (ex) {
            console.error("Failed to insert logs.");
            console.log(ex);
            throw ex;
        }
    }

    public async listLogs(params: ILoggerCrudListLogsParams): Promise<ILoggerCrudListLogsResponse> {
        const { where = {}, sort, limit = 50, after } = params;

        const { source, type, tenant } = where;

        const queryParams = this.createQueryParams({
            tenant,
            source,
            type,
            sort,
            after
        });

        const result = await queryPerPageClean<ILoggerLogDb>({
            entity: this.entity,
            partitionKey: queryParams.partitionKey,
            options: {
                index: queryParams.index,
                reverse: queryParams.reverse,
                startKey: queryParams.startKey,
                limit
            }
        });

        const cursor = convertLastEvaluatedKeyToAfterKey(result.lastEvaluatedKey);

        return {
            items: await Promise.all(
                result.items.map(async item => {
                    return {
                        ...item,
                        data: await this.decompress(item.data)
                    };
                })
            ),
            meta: {
                cursor,
                totalCount: -1,
                hasMoreItems: !!cursor
            }
        };
    }

    public async getLog(params: ILoggerCrudGetLogsParams): Promise<ILoggerLog | null> {
        const { where } = params;
        try {
            const item = await getClean<ILoggerLogDb>({
                entity: this.entity,
                keys: {
                    PK: this.keys.createPartitionKey(),
                    SK: this.keys.createSortKey(where)
                }
            });
            if (!item || (where.tenant && item.tenant !== where.tenant)) {
                return null;
            }
            return {
                ...item,
                data: await this.decompress(item.data)
            };
        } catch (ex) {
            console.error("Failed to get log.");
            throw ex;
        }
    }

    public async deleteLog(params: ILoggerCrudDeleteLogParams): Promise<ILoggerLog | null> {
        const item = await this.getLog(params);
        if (!item) {
            return null;
        }
        try {
            await this.entity.delete({
                PK: this.keys.createPartitionKey(),
                SK: this.keys.createSortKey(params.where)
            });
            return item;
        } catch (ex) {
            console.error("Failed to delete log.");
            throw ex;
        }
    }

    public async deleteLogs(params: ILoggerCrudDeleteLogsParams): Promise<ILoggerLog[]> {
        const items = params.where.items.map(id => {
            return this.entity.getBatch({
                PK: this.keys.createPartitionKey(),
                SK: this.keys.createSortKey({ id })
            });
        });
        const compressedResults = await batchReadAll<ILoggerLogDb>({
            items,
            table: this.entity.table
        });
        const cleanedResults = compressedResults
            .map(item => cleanupItem(this.entity, item))
            .filter((item): item is ILoggerLogDb => !!item);

        const results = await Promise.all(
            cleanedResults.map(async item => {
                return {
                    ...item,
                    data: await this.decompress(item.data)
                };
            })
        );
        try {
            await batchWriteAll({
                items: results.map(item => {
                    return this.entity.deleteBatch({
                        PK: this.keys.createPartitionKey(),
                        SK: this.keys.createSortKey({ id: item.id })
                    });
                }),
                table: this.entity.table
            });
            return results;
        } catch (ex) {
            console.error("Failed to delete logs.");
            throw ex;
        }
    }

    private async compress(input: unknown): Promise<string | undefined> {
        if (!input) {
            return undefined;
        }
        const str = JSON.stringify(input);
        const data = await compress(str);

        return data.toString(TO_STORAGE_ENCODING);
    }

    private async decompress<T = unknown>(input?: string): Promise<T | undefined> {
        if (!input) {
            return undefined;
        }
        try {
            const data = await decompress(Buffer.from(input, TO_STORAGE_ENCODING));
            return JSON.parse(data.toString(FROM_STORAGE_ENCODING)) as T;
        } catch (ex) {
            console.error("Failed to decompress data.");
            console.log(ex);
            return undefined;
        }
    }

    private createQueryParams(input: ICreateQueryParamsInput): ICreateQueryParamsResult {
        const { tenant, source, type, after, sort } = input;

        const reverse = sort ? sort.includes("DESC") : false;
        const startKey = convertAfterToStartKey(after);
        /**
         * Tenant related queries.
         */
        if (tenant) {
            if (source) {
                return {
                    index: "GSI4",
                    partitionKey: this.keys.createTenantAndSourcePartitionKey({ tenant, source }),
                    reverse,
                    startKey
                };
            } else if (type) {
                return {
                    index: "GSI5",
                    partitionKey: this.keys.createTenantAndTypePartitionKey({ tenant, type }),
                    reverse,
                    startKey
                };
            }
            return {
                index: "GSI3",
                partitionKey: this.keys.createTenantPartitionKey({ tenant }),
                reverse,
                startKey
            };
        }
        /**
         * All tenants queries.
         */
        if (source) {
            return {
                index: "GSI1",
                partitionKey: this.keys.createSourcePartitionKey({ source }),
                reverse,
                startKey
            };
        } else if (type) {
            return {
                index: "GSI2",
                partitionKey: this.keys.createTypePartitionKey({ type }),
                reverse,
                startKey
            };
        }
        return {
            index: undefined,
            partitionKey: this.keys.createPartitionKey(),
            reverse,
            startKey
        };
    }
}

export const createStorageOperations = (
    params: IDynamoDbStorageOperationsParams
): ILoggerStorageOperations => {
    return new DynamoDbStorageOperations(params);
};
