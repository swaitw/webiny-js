import { createZodError } from "@webiny/utils";
import type { DataLoaderResult, IDataLoader, IDataSource } from "~/dataSources/types";
import type { DataLoaderRequest } from "~/dataSources/DataLoaderRequest";

export class DataLoader implements IDataLoader {
    private readonly dataSources: IDataSource[];

    constructor(dataSources: IDataSource[]) {
        this.dataSources = dataSources;
    }

    async load(request: DataLoaderRequest): Promise<DataLoaderResult> {
        const type = request.getType();
        const dataSource = this.dataSources.find(ds => ds.getType() === type);

        if (!dataSource) {
            throw new Error(`Can't find dataSource ${type}`);
        }

        const configSchema = dataSource.getConfigSchema();
        const result = await configSchema.safeParseAsync(request.getConfig());
        if (!result.success) {
            throw createZodError(result.error);
        }

        return dataSource.load(request.withConfig(result.data));
    }
}
