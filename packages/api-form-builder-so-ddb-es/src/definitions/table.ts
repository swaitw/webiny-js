import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Table } from "dynamodb-toolbox";

export interface Params {
    tableName: string;
    documentClient: DocumentClient;
}

export const createTable = (params: Params): Table => {
    const { tableName, documentClient } = params;

    return new Table({
        name: tableName || process.env.DB_TABLE,
        partitionKey: "PK",
        sortKey: "SK",
        DocumentClient: documentClient
    });
};
