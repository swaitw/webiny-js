import { GenericRecord } from "@webiny/cli/types";
import { DynamoDBRecord } from "@webiny/handler-aws/types";
import { ElasticsearchContext } from "@webiny/api-elasticsearch/types";
import { Context as LoggerContext } from "@webiny/api-log/types";

export interface IOperationsBuilderBuildParams {
    records: DynamoDBRecord[];
}

export interface IOperationsBuilder {
    build(params: IOperationsBuilderBuildParams): Promise<IOperations>;
}

export interface IInsertOperationParams {
    id: string;
    index: string;
    data: GenericRecord;
}

export type IModifyOperationParams = IInsertOperationParams;

export interface IDeleteOperationParams {
    id: string;
    index: string;
}

export interface IOperations {
    items: GenericRecord[];
    total: number;
    clear(): void;
    insert(params: IInsertOperationParams): void;
    modify(params: IModifyOperationParams): void;
    delete(params: IDeleteOperationParams): void;
}

export interface IDecompressor {
    decompress(data: GenericRecord): Promise<GenericRecord | null>;
}

export interface Context extends ElasticsearchContext, Pick<LoggerContext, "logger"> {}
