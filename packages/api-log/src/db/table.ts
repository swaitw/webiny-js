import { DynamoDBDocument } from "@webiny/aws-sdk/client-dynamodb";
import { Table } from "@webiny/db-dynamodb/toolbox";
import { ITable } from "~/db/types";

interface Params {
    name: string;
    documentClient: DynamoDBDocument;
}

export const createTable = ({ name, documentClient }: Params): ITable => {
    return new Table({
        name,
        partitionKey: "PK",
        sortKey: "SK",
        DocumentClient: documentClient,
        /**
         * @see DynamoDbLoggerKeys.create
         */
        indexes: {
            // source
            GSI1: {
                partitionKey: "GSI1_PK",
                sortKey: "GSI1_SK"
            },
            // type
            GSI2: {
                partitionKey: "GSI2_PK",
                sortKey: "GSI2_SK"
            },
            // tenant
            GSI3: {
                partitionKey: "GSI3_PK",
                sortKey: "GSI3_SK"
            },
            // tenant and source
            GSI4: {
                partitionKey: "GSI4_PK",
                sortKey: "GSI4_SK"
            },
            // tenant and type
            GSI5: {
                partitionKey: "GSI5_PK",
                sortKey: "GSI5_SK"
            }
        },
        autoExecute: true,
        autoParse: true
    });
};
