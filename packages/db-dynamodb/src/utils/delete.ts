import { Entity } from "~/toolbox";
export interface IDeleteItemKeys {
    PK: string;
    SK: string;
}
export interface IDeleteItemParams {
    entity: Entity;
    keys: IDeleteItemKeys;
}

export const deleteItem = async (params: IDeleteItemParams) => {
    const { entity, keys } = params;

    return await entity.delete(keys, {
        execute: true
    });
};
