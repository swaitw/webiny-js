import type { Entity, TableDef } from "~/toolbox";
import type {
    BatchWriteItem,
    BatchWriteResult,
    IDeleteBatchItem,
    IPutBatchItem
} from "~/utils/batch/types";
import type { IEntityWriteBatchBuilder } from "~/utils/entity/types";
import { batchWriteAll } from "~/utils/batch/batchWrite";
import { createEntityWriteBatchBuilder } from "~/utils/entity/EntityWriteBatchBuilder";
import type { ITableWriteBatch } from "./types";

export interface ITableWriteBatchParams {
    table: TableDef;
    items?: BatchWriteItem[];
}

export class TableWriteBatch implements ITableWriteBatch {
    private readonly table: TableDef;
    private readonly _items: BatchWriteItem[] = [];
    private readonly builders: Map<string, IEntityWriteBatchBuilder> = new Map();

    public get total(): number {
        return this._items.length;
    }

    public get items(): BatchWriteItem[] {
        return Array.from(this._items);
    }

    public constructor(params: ITableWriteBatchParams) {
        this.table = params.table;
        if (!params.items?.length) {
            return;
        }
        this._items.push(...params.items);
    }

    public put(entity: Entity, item: IPutBatchItem): void {
        const builder = this.getBuilder(entity);
        this._items.push(builder.put(item));
    }

    public delete(entity: Entity, item: IDeleteBatchItem): void {
        const builder = this.getBuilder(entity);
        this._items.push(builder.delete(item));
    }

    public combine(items: BatchWriteItem[]): ITableWriteBatch {
        return createTableWriteBatch({
            table: this.table,
            items: this._items.concat(items)
        });
    }

    public async execute(): Promise<BatchWriteResult> {
        if (this._items.length === 0) {
            return [];
        }
        const items = Array.from(this._items);
        this._items.length = 0;
        return await batchWriteAll({
            items,
            table: this.table
        });
    }

    private getBuilder(entity: Entity): IEntityWriteBatchBuilder {
        if (!entity.name) {
            throw new Error("Entity must have a name.");
        }
        const builder = this.builders.get(entity.name);
        if (builder) {
            return builder;
        }
        const newBuilder = createEntityWriteBatchBuilder(entity);
        this.builders.set(entity.name, newBuilder);
        return newBuilder;
    }
}

export const createTableWriteBatch = (params: ITableWriteBatchParams): ITableWriteBatch => {
    return new TableWriteBatch(params);
};
