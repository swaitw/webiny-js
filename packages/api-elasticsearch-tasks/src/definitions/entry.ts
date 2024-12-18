/**
 * TODO If adding GSIs to the Elasticsearch table, add them here.
 */
import type { TableDef } from "@webiny/db-dynamodb/toolbox";
import type { IEntity } from "@webiny/db-dynamodb";
import { createEntity } from "@webiny/db-dynamodb";

interface Params {
    table: TableDef;
    entityName: string;
}

export const createEntry = (params: Params): IEntity => {
    const { table, entityName } = params;
    return createEntity({
        name: entityName,
        table,
        attributes: {
            PK: {
                type: "string",
                partitionKey: true
            },
            SK: {
                type: "string",
                sortKey: true
            },
            index: {
                type: "string"
            },
            data: {
                type: "map"
            },
            TYPE: {
                type: "string"
            }
        }
    });
};
