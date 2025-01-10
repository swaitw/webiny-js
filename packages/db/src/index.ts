import { DbRegistry } from "~/DbRegistry";
import { IStore } from "~/store/types";
import { Store } from "~/store/Store";

export * from "./types";

export interface DbDriver<T> extends IStore {
    getClient(): T;
}

export interface ConstructorArgs<T> {
    driver: DbDriver<T>;
    table?: string;
}

class Db<T> {
    public driver: DbDriver<T>;
    public readonly table?: string;
    public readonly store: IStore;

    public readonly registry = new DbRegistry();

    constructor({ driver, table }: ConstructorArgs<T>) {
        this.table = table;
        this.driver = driver;
        this.store = new Store<T>({
            driver
        });
    }
}

export { Db };
