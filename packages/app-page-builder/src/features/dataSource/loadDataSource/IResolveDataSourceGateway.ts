import { DataRequest, DataSourceData } from "./IResolveDataSourceRepository";

export interface IResolveDataSourceGateway {
    execute(request: DataRequest): Promise<DataSourceData>;
}
