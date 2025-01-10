import type { Entity as BaseEntity } from "dynamodb-toolbox";
import type {
    BatchWriteItem,
    BatchWriteResult,
    IDeleteBatchItem,
    IPutBatchItem
} from "~/utils/batch/types";
import type { GenericRecord } from "@webiny/api/types";
import type { TableDef } from "~/toolbox";
import type { ITableWriteBatch } from "~/utils/table/types";
import type { IPutParamsItem, put } from "~/utils/put";
import type { QueryAllParams, QueryOneParams } from "~/utils/query";
import type { get, getClean, GetRecordParamsKeys } from "~/utils/get";
import type { deleteItem, IDeleteItemKeys } from "~/utils/delete";
import type { batchReadAll } from "~/utils/batch/batchRead";

export type IEntityQueryOneParams = Omit<QueryOneParams, "entity">;

export type IEntityQueryAllParams = Omit<QueryAllParams, "entity">;

export interface IEntity {
    readonly entity: BaseEntity;
    createEntityReader(): IEntityReadBatch;
    createEntityWriter(): IEntityWriteBatch;
    createTableWriter(): ITableWriteBatch;
    put<T extends GenericRecord = GenericRecord>(item: IPutParamsItem<T>): ReturnType<typeof put>;
    get<T>(keys: GetRecordParamsKeys): ReturnType<typeof get<T>>;
    getClean<T>(keys: GetRecordParamsKeys): ReturnType<typeof getClean<T>>;
    delete(keys: IDeleteItemKeys): ReturnType<typeof deleteItem>;
    queryOne<T>(params: IEntityQueryOneParams): Promise<T | null>;
    queryAll<T>(params: IEntityQueryAllParams): Promise<T[]>;
}

export interface IEntityWriteBatchBuilder {
    // readonly entity: Entity;
    put<T extends Record<string, any>>(item: IPutBatchItem<T>): BatchWriteItem;
    delete(item: IDeleteBatchItem): BatchWriteItem;
}

export interface IEntityWriteBatch {
    readonly total: number;
    // readonly entity: Entity;
    readonly items: BatchWriteItem[];
    // readonly builder: IEntityWriteBatchBuilder;

    put(item: IPutBatchItem): void;
    delete(item: IDeleteBatchItem): void;
    execute(): Promise<BatchWriteResult>;
    combine(items: BatchWriteItem[]): ITableWriteBatch;
}

export interface IEntityReadBatchKey {
    PK: string;
    SK: string;
}

export interface IEntityReadBatch {
    get(input: IEntityReadBatchKey | IEntityReadBatchKey[]): void;
    execute<T = GenericRecord>(): ReturnType<typeof batchReadAll<T>>;
}

export interface IEntityReadBatchBuilderGetResponse {
    Table: TableDef;
    Key: IEntityReadBatchKey;
}

export interface IEntityReadBatchBuilder {
    get(item: IEntityReadBatchKey): IEntityReadBatchBuilderGetResponse;
}
