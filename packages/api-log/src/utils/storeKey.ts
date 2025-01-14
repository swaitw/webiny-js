import { StorageKey } from "@webiny/db";

export const createStoreKey = (): StorageKey => {
    return `logs#prune`;
};
