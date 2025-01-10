import { scan as tableScan, ScanOptions } from "@webiny/db-dynamodb";
import { TableDef } from "@webiny/db-dynamodb/toolbox";
import { IElasticsearchIndexingTaskValuesKeys } from "~/types";

interface Params {
    table: TableDef;
    keys?: IElasticsearchIndexingTaskValuesKeys;
    options?: ScanOptions;
}

export const scan = async <T = any>(params: Params) => {
    const { table, keys } = params;
    return tableScan<T>({
        table,
        options: {
            ...params.options,
            startKey: keys,
            limit: params.options?.limit || 200
        }
    });
};
