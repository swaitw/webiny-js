import { DynamoDBDocument } from "@webiny/aws-sdk/client-dynamodb";
import { Table as BaseTable } from "~/toolbox";

export interface CreateTableParams {
    name?: string;
    documentClient: DynamoDBDocument;
}

export type Table = BaseTable<string, "PK", "SK">;

export const createTable = ({ name, documentClient }: CreateTableParams): Table => {
    return new BaseTable({
        name: name || String(process.env.DB_TABLE),
        partitionKey: "PK",
        sortKey: "SK",
        DocumentClient: documentClient,
        indexes: {
            GSI1: {
                partitionKey: "GSI1_PK",
                sortKey: "GSI1_SK"
            }
        },
        autoExecute: true,
        autoParse: true
    });
};
