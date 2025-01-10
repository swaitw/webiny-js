import type { WriteRequest } from "@webiny/aws-sdk/client-dynamodb";

export interface BatchWriteResponse {
    next?: () => Promise<BatchWriteResponse>;
    $metadata: {
        httpStatusCode: number;
        requestId: string;
        attempts: number;
        totalRetryDelay: number;
    };
    UnprocessedItems?: {
        [table: string]: WriteRequest[];
    };
}

export type BatchWriteResult = BatchWriteResponse[];

export interface IDeleteBatchItem {
    PK: string;
    SK: string;
}

export type IPutBatchItem<T extends Record<string, any> = Record<string, any>> = {
    PK: string;
    SK: string;
} & T;

export interface BatchWriteItem {
    [key: string]: WriteRequest;
}
