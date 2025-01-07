import type { GenericRecord } from "@webiny/api/types";
import type { RequestDto } from "~/dataSources/types";

export class DataLoaderRequest<TConfig extends GenericRecord = GenericRecord> {
    private readonly type: string;
    private readonly config: TConfig;
    private readonly paths: string[];

    protected constructor(type: string, config: TConfig, paths: string[]) {
        this.type = type;
        this.config = config;
        this.paths = paths;
    }

    static create(params: RequestDto) {
        return new DataLoaderRequest(params.type, params.config, params.paths);
    }

    getType() {
        return this.type;
    }

    getConfig() {
        return this.config;
    }

    getPaths() {
        return this.paths || [];
    }

    withConfig(config: TConfig) {
        return new DataLoaderRequest(this.type, config, this.paths);
    }
}
