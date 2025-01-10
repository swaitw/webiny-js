import { Entity, TableDef } from "@webiny/db-dynamodb/toolbox";
import { Context } from "~/types";
import { NonEmptyArray } from "@webiny/api/types";
import { IRegistryItem } from "@webiny/db";

export interface IGetTableParams {
    context: Pick<Context, "db">;
    type: "regular" | "es";
}

const createPredicate = (app: string, tags: NonEmptyArray<string>) => {
    return (item: IRegistryItem) => {
        return item.app === app && tags.every(tag => item.tags.includes(tag));
    };
};

export const getTable = (params: IGetTableParams): TableDef => {
    const { context, type } = params;

    const getByPredicate = (predicate: (item: IRegistryItem) => boolean) => {
        const item = context.db.registry.getOneItem<Entity>(predicate);
        return item.item;
    };

    const entity = getByPredicate(createPredicate("cms", [type]));
    if (!entity) {
        throw new Error(`Unknown entity type "${type}".`);
    }
    return entity.table as TableDef;
};
