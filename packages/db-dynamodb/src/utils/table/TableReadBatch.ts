import type { Entity, TableDef } from "~/toolbox";
import type {
    IEntityReadBatchBuilder,
    IEntityReadBatchBuilderGetResponse
} from "~/utils/entity/types";
import { batchReadAll } from "~/utils/batch/batchRead";
import { createEntityReadBatchBuilder } from "~/utils/entity/EntityReadBatchBuilder";
import type { GenericRecord } from "@webiny/api/types";
import { WebinyError } from "@webiny/error";
import type { ITableReadBatch, ITableReadBatchKey } from "./types";

export interface ITableReadBatchParams {
    table: TableDef;
}

export class TableReadBatch implements ITableReadBatch {
    private readonly table: TableDef;

    private readonly _items: IEntityReadBatchBuilderGetResponse[] = [];
    private readonly builders: Map<string, IEntityReadBatchBuilder> = new Map();

    public constructor(params: ITableReadBatchParams) {
        this.table = params.table;
    }

    public get total(): number {
        return this._items.length;
    }

    public get items(): IEntityReadBatchBuilderGetResponse[] {
        return Array.from(this._items);
    }

    public get(entity: Entity, input: ITableReadBatchKey): void {
        const builder = this.getBuilder(entity);

        const items = Array.isArray(input) ? input : [input];
        for (const item of items) {
            /**
             * We cannot read from two tables at the same time, so check for that.
             */
            if (this.table.name !== entity.table!.name) {
                throw new WebinyError(`Cannot read from two different tables at the same time.`);
            }

            this._items.push(builder.get(item));
        }
    }

    public async execute<T = GenericRecord>(): Promise<T[]> {
        if (this._items.length === 0) {
            return [];
        }
        const items = Array.from(this._items);
        this._items.length = 0;
        return await batchReadAll<T>({
            items,
            table: this.table
        });
    }

    private getBuilder(entity: Entity): IEntityReadBatchBuilder {
        const builder = this.builders.get(entity.name);
        if (builder) {
            return builder;
        }
        const newBuilder = createEntityReadBatchBuilder(entity);
        this.builders.set(entity.name, newBuilder);
        return newBuilder;
    }
}

export const createTableReadBatch = (params: ITableReadBatchParams): ITableReadBatch => {
    return new TableReadBatch(params);
};
