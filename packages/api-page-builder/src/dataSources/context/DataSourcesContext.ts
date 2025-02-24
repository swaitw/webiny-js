import { IDataLoader, IDataSource, IDataSourceContext } from "~/dataSources/types";
import { DataLoader } from "~/dataSources/DataLoader";

export class DataSourcesContext implements IDataSourceContext {
    private dataSources: IDataSource[] = [];

    addDataSource(dataSource: IDataSource): void {
        this.dataSources.push(dataSource);
    }

    getLoader(): IDataLoader {
        return new DataLoader(this.dataSources);
    }
}
