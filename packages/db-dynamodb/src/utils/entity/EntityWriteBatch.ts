import type { TableDef } from "~/toolbox";
import type { Entity as ToolboxEntity } from "~/toolbox";
import { batchWriteAll } from "~/utils/batch/batchWrite";
import type {
    BatchWriteItem,
    BatchWriteResult,
    IDeleteBatchItem,
    IPutBatchItem
} from "~/utils/batch/types";
import type { IEntityWriteBatch, IEntityWriteBatchBuilder } from "./types";
import type { ITableWriteBatch } from "~/utils/table/types";
import { createTableWriteBatch } from "~/utils/table/TableWriteBatch";
import { createEntityWriteBatchBuilder } from "./EntityWriteBatchBuilder";
import type { EntityOption } from "./getEntity";
import { getEntity } from "./getEntity";

export interface IEntityWriteBatchParams {
    entity: EntityOption;
    put?: IPutBatchItem[];
    delete?: IDeleteBatchItem[];
}

export class EntityWriteBatch implements IEntityWriteBatch {
    private readonly entity: ToolboxEntity;
    private readonly _items: BatchWriteItem[] = [];
    private readonly builder: IEntityWriteBatchBuilder;

    public get total(): number {
        return this._items.length;
    }

    public get items(): BatchWriteItem[] {
        return Array.from(this._items);
    }

    public constructor(params: IEntityWriteBatchParams) {
        this.entity = getEntity(params.entity);
        this.builder = createEntityWriteBatchBuilder(this.entity);
        for (const item of params.put || []) {
            this.put(item);
        }
        for (const item of params.delete || []) {
            this.delete(item);
        }
    }

    public put<T extends Record<string, any>>(item: IPutBatchItem<T>): void {
        this._items.push(this.builder.put(item));
    }

    public delete(item: IDeleteBatchItem): void {
        this._items.push(this.builder.delete(item));
    }

    public combine(items: BatchWriteItem[]): ITableWriteBatch {
        return createTableWriteBatch({
            table: this.entity!.table as TableDef,
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
            table: this.entity.table
        });
    }
}

export const createEntityWriteBatch = (params: IEntityWriteBatchParams): IEntityWriteBatch => {
    return new EntityWriteBatch(params);
};
