import DataLoader from "dataloader";
import { CategoryStorageOperationsDdbEs } from "./CategoryStorageOperations";
import { batchReadAll } from "@webiny/db-dynamodb/utils/batchRead";
import { Category } from "@webiny/api-page-builder/types";
import { cleanupItem } from "@webiny/db-dynamodb/utils/cleanup";

interface Params {
    storageOperations: CategoryStorageOperationsDdbEs;
}

interface DataLoaderGetItem {
    slug: string;
    tenant: string;
    locale: string;
}

export class CategoryDataLoader {
    private readonly storageOperations: CategoryStorageOperationsDdbEs;
    private _getDataLoader: DataLoader<any, any>;

    constructor(params: Params) {
        this.storageOperations = params.storageOperations;
    }

    public async getOne(item: DataLoaderGetItem): Promise<Category> {
        return await this.getDataLoader().load(item);
    }

    public async getAll(items: DataLoaderGetItem[]): Promise<Category[]> {
        return await this.getDataLoader().loadMany(items);
    }

    public clear(): void {
        this.getDataLoader().clearAll();
    }

    private getDataLoader() {
        if (!this._getDataLoader) {
            const cacheKeyFn = (key: DataLoaderGetItem) => {
                return `T#${key.tenant}#L#${key.locale}#${key.slug}`;
            };
            this._getDataLoader = new DataLoader(
                async (items: DataLoaderGetItem[]) => {
                    const batched = items.map(item => {
                        return this.storageOperations.entity.getBatch({
                            PK: this.storageOperations.createPartitionKey(item),
                            SK: this.storageOperations.createSortKey(item)
                        });
                    });

                    const records = await batchReadAll<Category>({
                        table: this.storageOperations.table,
                        items: batched
                    });

                    const results = records.reduce(
                        (collection, result: Category & DataLoaderGetItem) => {
                            if (!result) {
                                return collection;
                            }
                            const key = cacheKeyFn(result);
                            collection[key] = cleanupItem(this.storageOperations.entity, result);
                            return collection;
                        },
                        {} as Record<string, Category>
                    );
                    return items.map(item => {
                        const key = cacheKeyFn(item);
                        return results[key] || null;
                    });
                },
                {
                    cacheKeyFn
                }
            );
        }
        return this._getDataLoader;
    }
}
