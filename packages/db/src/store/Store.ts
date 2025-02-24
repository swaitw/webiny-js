import {
    GetValueResult,
    GetValuesResult,
    IListValuesParams,
    IStore,
    ListValuesResult,
    RemoveValueResult,
    RemoveValuesResult,
    StorageKey,
    StoreValueResult,
    StoreValuesResult
} from "./types";
import { GenericRecord } from "@webiny/api/types";
import { DbDriver } from "~/index";

export interface IStoreParams<T> {
    driver: DbDriver<T>;
}

export class Store<T> implements IStore {
    private driver: DbDriver<T>;

    public constructor(params: IStoreParams<T>) {
        this.driver = params.driver;
    }

    public async storeValue<V>(key: StorageKey, value: V): Promise<StoreValueResult<V>> {
        return this.driver.storeValue<V>(key, value);
    }

    public async storeValues<V extends GenericRecord<StorageKey>>(
        values: V
    ): Promise<StoreValuesResult<V>> {
        return this.driver.storeValues<V>(values);
    }

    public async getValue<V>(key: StorageKey): Promise<GetValueResult<V>> {
        return this.driver.getValue<V>(key);
    }

    public async getValues<V extends GenericRecord<StorageKey>>(
        keys: (keyof V)[]
    ): Promise<GetValuesResult<V>> {
        return this.driver.getValues<V>(keys);
    }

    public async listValues<V extends GenericRecord<StorageKey>>(
        params?: IListValuesParams
    ): Promise<ListValuesResult<V>> {
        return this.driver.listValues<V>(params);
    }

    public async removeValue<V>(key: StorageKey): Promise<RemoveValueResult<V>> {
        return this.driver.removeValue<V>(key);
    }

    public async removeValues<V extends GenericRecord<StorageKey>>(
        keys: (keyof V)[]
    ): Promise<RemoveValuesResult<V>> {
        return this.driver.removeValues<V>(keys);
    }
}
