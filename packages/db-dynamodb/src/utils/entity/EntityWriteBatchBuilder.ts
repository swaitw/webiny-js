import type { Entity } from "~/toolbox";
import type { BatchWriteItem, IDeleteBatchItem, IPutBatchItem } from "~/utils/batch/types";
import type { IEntityWriteBatchBuilder } from "./types";
import type { EntityOption } from "./getEntity";
import { getEntity } from "./getEntity";

export class EntityWriteBatchBuilder implements IEntityWriteBatchBuilder {
    private readonly entity: Entity;

    public constructor(entity: EntityOption) {
        this.entity = getEntity(entity);
    }

    public put<T extends Record<string, any>>(item: IPutBatchItem<T>): BatchWriteItem {
        return this.entity.putBatch(item, {
            execute: true,
            strictSchemaCheck: false
        });
    }

    public delete(item: IDeleteBatchItem): BatchWriteItem {
        return this.entity.deleteBatch(item);
    }
}

export const createEntityWriteBatchBuilder = (entity: Entity): IEntityWriteBatchBuilder => {
    return new EntityWriteBatchBuilder(entity);
};
