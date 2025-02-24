import type { TableDef } from "dynamodb-toolbox/dist/cjs/classes/Table/types";
import type {
    BatchWriteItem,
    BatchWriteResult,
    IDeleteBatchItem,
    IPutBatchItem
} from "~/utils/batch/types";
import type { BaseScanParams, ScanResponse } from "../scan";
import type { Entity } from "~/toolbox";
import type { GenericRecord } from "@webiny/api/types";

export type ITableScanParams = BaseScanParams;

export type ITableScanResponse<T> = ScanResponse<T>;

export interface ITable {
    table: TableDef;
    createWriter(): ITableWriteBatch;
    createReader(): ITableReadBatch;
    scan<T>(params: ITableScanParams): Promise<ITableScanResponse<T>>;
}

export interface ITableWriteBatch {
    readonly total: number;
    // readonly table: TableDef;
    readonly items: BatchWriteItem[];
    put(entity: Entity, item: IPutBatchItem): void;
    delete(entity: Entity, item: IDeleteBatchItem): void;
    execute(): Promise<BatchWriteResult>;
    combine(items: BatchWriteItem[]): ITableWriteBatch;
}

export interface ITableReadBatchKey {
    PK: string;
    SK: string;
}

export interface ITableReadBatchBuilderGetResponse {
    Table: TableDef;
    Key: ITableReadBatchKey;
}

export interface ITableReadBatchKey {
    PK: string;
    SK: string;
}

export interface ITableReadBatch {
    readonly total: number;
    readonly items: ITableReadBatchBuilderGetResponse[];
    get(entity: Entity, input: ITableReadBatchKey | ITableReadBatchKey[]): void;
    execute<T = GenericRecord>(): Promise<T[]>;
}
