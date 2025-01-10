import type { IPutBatchItem } from "~/utils/batch/types";
import type {
    IEntityReadBatch,
    IEntityReadBatchBuilder,
    IEntityReadBatchBuilderGetResponse,
    IEntityReadBatchKey
} from "./types";
import type { TableDef } from "~/toolbox";
import type { Entity as ToolboxEntity } from "~/toolbox";
import { batchReadAll } from "~/utils/batch/batchRead";
import { GenericRecord } from "@webiny/api/types";
import { createEntityReadBatchBuilder } from "./EntityReadBatchBuilder";
import type { EntityOption } from "./getEntity";
import { getEntity } from "./getEntity";

export interface IEntityReadBatchParams {
    entity: EntityOption;
    read?: IPutBatchItem[];
}

export class EntityReadBatch implements IEntityReadBatch {
    private readonly entity: ToolboxEntity;
    private readonly builder: IEntityReadBatchBuilder;
    private readonly _items: IEntityReadBatchBuilderGetResponse[] = [];

    public constructor(params: IEntityReadBatchParams) {
        this.entity = getEntity(params.entity);
        this.builder = createEntityReadBatchBuilder(this.entity);
        for (const item of params.read || []) {
            this.get(item);
        }
    }
    public get(input: IEntityReadBatchKey | IEntityReadBatchKey[]): void {
        if (Array.isArray(input)) {
            this._items.push(
                ...input.map(item => {
                    return this.builder.get(item);
                })
            );
            return;
        }
        this._items.push(this.builder.get(input));
    }

    public async execute<T = GenericRecord>() {
        return await batchReadAll<T>({
            table: this.entity.table as TableDef,
            items: this._items
        });
    }
}

export const createEntityReadBatch = (params: IEntityReadBatchParams): IEntityReadBatch => {
    return new EntityReadBatch(params);
};
