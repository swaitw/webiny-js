import type { TableConstructor } from "~/toolbox";
import { Table as BaseTable } from "~/toolbox";
import type {
    ITable,
    ITableReadBatch,
    ITableScanParams,
    ITableScanResponse,
    ITableWriteBatch
} from "./types";
import { createTableWriteBatch } from "./TableWriteBatch";
import { createTableReadBatch } from "./TableReadBatch";
import { scan } from "../scan";

export class TableDefinition<
    Name extends string = string,
    PartitionKey extends string = string,
    SortKey extends string = string
> implements ITable
{
    public readonly table: BaseTable<Name, PartitionKey, SortKey>;

    public constructor(params: TableConstructor<Name, PartitionKey, SortKey>) {
        this.table = new BaseTable(params);
    }

    public createWriter(): ITableWriteBatch {
        return createTableWriteBatch({
            table: this.table
        });
    }

    public createReader(): ITableReadBatch {
        return createTableReadBatch({
            table: this.table
        });
    }

    public async scan<T>(params: ITableScanParams): Promise<ITableScanResponse<T>> {
        return scan<T>({
            ...params,
            table: this.table
        });
    }
}

export const defineTable = <
    Name extends string = string,
    PartitionKey extends string = string,
    SortKey extends string = string
>(
    params: TableConstructor<Name, PartitionKey, SortKey>
) => {
    return new TableDefinition<Name, PartitionKey, SortKey>(params);
};
