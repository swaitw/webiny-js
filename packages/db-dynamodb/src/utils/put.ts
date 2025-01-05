import { Entity } from "~/toolbox";
import { GenericRecord } from "@webiny/api/types";

export type IPutParamsItem<T extends GenericRecord = GenericRecord> = {
    PK: string;
    SK: string;
    [key: string]: any;
} & T;

export interface IPutParams<T extends GenericRecord = GenericRecord> {
    entity: Entity;
    item: IPutParamsItem<T>;
}

export const put = async <T extends GenericRecord = GenericRecord>(params: IPutParams<T>) => {
    const { entity, item } = params;

    return await entity.put(item, {
        execute: true,
        strictSchemaCheck: false
    });
};
