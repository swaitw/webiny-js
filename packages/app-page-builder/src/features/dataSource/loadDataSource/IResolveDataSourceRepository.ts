import type { GenericRecord } from "@webiny/app/types";
import { Checksum } from "./Checksum";

export type DataSourceData = GenericRecord<string>;

export interface IDataRequest {
    name: string;
    type: string;
    config: GenericRecord;
    paths?: string[];
}

export class DataRequest {
    private readonly request: IDataRequest;

    protected constructor(request: IDataRequest) {
        this.request = request;
    }

    static create(request: IDataRequest) {
        return new DataRequest(request);
    }

    getKey() {
        return `${this.getName()}:${this.getType()}`;
    }

    getName() {
        return this.request.name;
    }

    getType() {
        return this.request.type;
    }

    getConfig() {
        return this.request.config;
    }

    getPaths() {
        return this.request.paths ?? [];
    }

    async getChecksum() {
        const checksum = await Checksum.createFrom({
            config: this.request.config,
            paths: this.request.paths
        });
        return checksum.getChecksum();
    }
}

export interface IResolveDataSourceRepository {
    getData(key: string): DataSourceData | undefined;
    resolveData(request: DataRequest): Promise<void>;
}
