import { CamelCase } from "type-fest";
import { GenericRecord } from "@webiny/api/types";

export type StorageKey = `${CamelCase<string>}`;

export interface IStoreValueSuccessResult<V> {
    key: StorageKey;
    data: V | null | undefined;
    error?: undefined;
}

export interface IStoreValueErrorResult {
    key: StorageKey;
    data?: never;
    error: Error;
}

export type StoreValueResult<V> = IStoreValueSuccessResult<V> | IStoreValueErrorResult;

export interface IStoreValuesSuccessResult<V extends GenericRecord<StorageKey>> {
    keys: (keyof V)[];
    data: V;
    error?: undefined;
}

export interface IStoreValuesErrorResult<V> {
    keys: (keyof V)[];
    data?: never;
    error: Error;
}

export type StoreValuesResult<V extends GenericRecord<StorageKey>> =
    | IStoreValuesSuccessResult<V>
    | IStoreValuesErrorResult<V>;

export interface IGetValueSuccessResult<V> {
    key: StorageKey;
    data: V | null | undefined;
    error?: undefined;
}

export interface IGetValueErrorResult {
    key: StorageKey;
    data?: never;
    error: Error;
}

export type GetValueResult<V> = IGetValueSuccessResult<V> | IGetValueErrorResult;

export interface IGetValuesSuccessResult<V extends GenericRecord<StorageKey>> {
    keys: (keyof V)[];
    data: V;
    error?: undefined;
}

export interface IGetValuesErrorResult<V> {
    keys: (keyof V)[];
    data?: never;
    error: Error;
}

export type GetValuesResult<V extends GenericRecord<StorageKey>> =
    | IGetValuesSuccessResult<V>
    | IGetValuesErrorResult<V>;

export interface IListValuesSuccessResult<V extends GenericRecord<StorageKey>> {
    keys: (keyof V)[];
    data: V;
    error?: undefined;
}

export interface IListValuesErrorResult {
    data?: never;
    error: Error;
}

export type ListValuesResult<V extends GenericRecord<StorageKey>> =
    | IListValuesSuccessResult<V>
    | IListValuesErrorResult;

export type IListValuesParams =
    | {
          beginsWith: string;
      }
    | {
          eq: string;
      }
    | {
          gt: string;
      }
    | {
          gte: string;
      }
    | {
          lt: string;
      }
    | {
          lte: string;
      };

export type RemoveValueResult<V> = StoreValueResult<V>;

export interface RemoveValuesResult<V extends GenericRecord<StorageKey>> {
    keys: (keyof V)[];
    error?: Error;
}

export interface IStore {
    storeValue<V>(key: StorageKey, value: V): Promise<StoreValueResult<V>>;
    storeValues<V extends GenericRecord<StorageKey>>(values: V): Promise<StoreValuesResult<V>>;
    getValue<V>(key: StorageKey): Promise<GetValueResult<V>>;
    getValues<V extends GenericRecord<StorageKey>>(keys: (keyof V)[]): Promise<GetValuesResult<V>>;
    listValues<V extends GenericRecord<StorageKey>>(
        params?: IListValuesParams
    ): Promise<ListValuesResult<V>>;
    removeValue<V>(key: StorageKey): Promise<RemoveValueResult<V>>;
    removeValues<V extends GenericRecord<StorageKey>>(
        keys: (keyof V)[]
    ): Promise<RemoveValuesResult<V>>;
}
