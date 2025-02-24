import type {
    AttributeDefinitions,
    EntityConstructor as BaseEntityConstructor,
    Readonly,
    TableDef
} from "~/toolbox";
import { Entity as BaseEntity } from "~/toolbox";
import type { ITableWriteBatch } from "../table/types";
import type {
    IEntity,
    IEntityQueryAllParams,
    IEntityQueryOneParams,
    IEntityReadBatch,
    IEntityWriteBatch
} from "./types";
import type { IPutParamsItem } from "../put";
import { put } from "../put";
import type { GetRecordParamsKeys } from "../get";
import { get, getClean } from "../get";
import type { IDeleteItemKeys } from "../delete";
import { deleteItem } from "../delete";
import { createEntityReadBatch } from "./EntityReadBatch";
import { createEntityWriteBatch } from "./EntityWriteBatch";
import { createTableWriteBatch } from "~/utils/table/TableWriteBatch";
import { queryAllClean, queryOneClean } from "../query";
import { GenericRecord } from "@webiny/api/types";

export type EntityConstructor<
    T extends Readonly<AttributeDefinitions> = Readonly<AttributeDefinitions>
> = BaseEntityConstructor<
    TableDef,
    string,
    true,
    true,
    true,
    "created",
    "modified",
    "entity",
    false,
    T
>;

export class Entity implements IEntity {
    public readonly entity: BaseEntity;

    public constructor(params: EntityConstructor) {
        this.entity = new BaseEntity(params);
    }

    public createEntityReader(): IEntityReadBatch {
        return createEntityReadBatch({
            entity: this.entity
        });
    }

    public createEntityWriter(): IEntityWriteBatch {
        return createEntityWriteBatch({
            entity: this.entity
        });
    }

    public createTableWriter(): ITableWriteBatch {
        return createTableWriteBatch({
            table: this.entity.table as TableDef
        });
    }

    public async put<T extends GenericRecord = GenericRecord>(
        item: IPutParamsItem<T>
    ): ReturnType<typeof put> {
        return put({
            entity: this.entity,
            item
        });
    }

    public async get<T>(keys: GetRecordParamsKeys): ReturnType<typeof get<T>> {
        return get<T>({
            entity: this.entity,
            keys
        });
    }

    public async getClean<T>(keys: GetRecordParamsKeys): ReturnType<typeof getClean<T>> {
        return getClean<T>({
            entity: this.entity,
            keys
        });
    }

    public async delete(keys: IDeleteItemKeys): ReturnType<typeof deleteItem> {
        return deleteItem({
            entity: this.entity,
            keys
        });
    }

    public queryOne<T>(params: IEntityQueryOneParams): Promise<T | null> {
        return queryOneClean<T>({
            ...params,
            entity: this.entity
        });
    }

    public queryAll<T>(params: IEntityQueryAllParams): Promise<T[]> {
        return queryAllClean<T>({
            ...params,
            entity: this.entity
        });
    }
}

export const createEntity = (params: EntityConstructor): IEntity => {
    return new Entity(params);
};
