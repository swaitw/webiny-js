import type { ElasticsearchContext } from "@webiny/api-elasticsearch/types";
import type {
    Context as TasksContext,
    IIsCloseToTimeoutCallable,
    ITaskManagerStore,
    ITaskResponse,
    ITaskResponseDoneResultOutput
} from "@webiny/tasks/types";
import type { DynamoDBDocument } from "@webiny/aws-sdk/client-dynamodb";
import type { Client } from "@webiny/api-elasticsearch";
import { createTable } from "~/definitions";
import type { BatchReadItem, IEntity } from "@webiny/db-dynamodb";
import type { ITimer } from "@webiny/handler-aws";
import type { GenericRecord } from "@webiny/api/types";
import { Context as LoggerContext } from "@webiny/api-log/types";

export interface Context extends ElasticsearchContext, TasksContext, LoggerContext {}

export interface IElasticsearchTaskConfig {
    documentClient?: DynamoDBDocument;
    elasticsearchClient?: Client;
}

export interface IElasticsearchIndexingTaskValuesKeys {
    PK: string;
    SK: string;
}

export interface IIndexSettingsValues {
    numberOfReplicas: number;
    refreshInterval: string;
}

export interface IElasticsearchIndexingTaskValuesSettings {
    [key: string]: IIndexSettingsValues;
}

export interface IElasticsearchIndexingTaskValues {
    matching?: string;
    limit?: number;
    keys?: IElasticsearchIndexingTaskValuesKeys;
    settings?: IElasticsearchIndexingTaskValuesSettings;
}

export interface AugmentedError extends Error {
    data?: GenericRecord;
    [key: string]: any;
}

export interface IDynamoDbElasticsearchRecord {
    PK: string;
    SK: string;
    TYPE?: string;
    index: string;
    _et?: string;
    entity: string;
    data: GenericRecord;
    modified: string;
}

export interface IManager<
    T,
    O extends ITaskResponseDoneResultOutput = ITaskResponseDoneResultOutput
> {
    readonly documentClient: DynamoDBDocument;
    readonly elasticsearch: Client;
    readonly context: Context;
    readonly table: ReturnType<typeof createTable>;
    readonly isCloseToTimeout: IIsCloseToTimeoutCallable;
    readonly isAborted: () => boolean;
    readonly response: ITaskResponse<T, O>;
    readonly store: ITaskManagerStore<T>;
    readonly timer: ITimer;

    getEntity: (name: string) => IEntity;

    read<T>(items: BatchReadItem[]): Promise<T[]>;
}
