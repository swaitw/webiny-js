import type { IStoreValue } from "~/tasks/deleteModel/types";

export interface ICreateIsModelBeingDeletedParams {
    listModelsBeingDeleted: () => Promise<IStoreValue[]>;
}

export const createIsModelBeingDeleted = (params: ICreateIsModelBeingDeletedParams) => {
    return async (modelId: string) => {
        const items = await params.listModelsBeingDeleted();
        return items.some(item => item.modelId === modelId);
    };
};
