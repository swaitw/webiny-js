import { Entity } from "~/toolbox";

export type IPutParamsItem<T extends Record<string, any>> = {
    PK: string;
    SK: string;
    [key: string]: any;
} & T;

export interface IPutParams<T extends Record<string, any>> {
    entity: Entity;
    item: IPutParamsItem<T>;
}

export const put = async <T extends Record<string, any>>(params: IPutParams<T>) => {
    const { entity, item } = params;

    return await entity.put(item, {
        execute: true,
        strictSchemaCheck: false
    });
};
