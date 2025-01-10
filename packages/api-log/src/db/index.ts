import { createTable } from "~/db/table";
import { createEntity } from "~/db/entity";
import { DynamoDBDocument } from "@webiny/aws-sdk/client-dynamodb";

interface IParams {
    documentClient: DynamoDBDocument;
    table?: string;
}

export const create = (params: IParams) => {
    const name = params.table || process.env.DB_TABLE_LOG;
    if (!name) {
        throw new Error("Missing table name when creating a logger table.");
    }
    const table = createTable({
        documentClient: params.documentClient,
        name
    });

    const entity = createEntity({
        table
    });
    return {
        table,
        entity
    };
};
