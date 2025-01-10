import { IStoreValue } from "~/tasks/deleteModel/types";
import { StorageKey } from "@webiny/db/types";

export interface ICreateStoreKeyParams {
    modelId: string;
    tenant: string;
    locale: string;
}

export const createStoreNamespace = (params: Pick<ICreateStoreKeyParams, "tenant" | "locale">) => {
    return `deletingCmsModel#T#${params.tenant}#L#${params.locale}#`;
};

export const createStoreKey = (params: ICreateStoreKeyParams): StorageKey => {
    return `${createStoreNamespace(params)}${params.modelId}`;
};

export const createStoreValue = (params: IStoreValue): IStoreValue => {
    return {
        modelId: params.modelId,
        task: params.task,
        identity: params.identity,
        tenant: params.tenant,
        locale: params.locale
    };
};
