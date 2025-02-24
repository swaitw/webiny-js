import {
    IDataSynchronizationInput,
    IDataSynchronizationManager,
    IFactories
} from "~/tasks/dataSynchronization/types";
import { IIndexManager } from "~/settings/types";
import { ElasticsearchSynchronize } from "~/tasks/dataSynchronization/elasticsearch/ElasticsearchSynchronize";
import { ElasticsearchFetcher } from "~/tasks/dataSynchronization/elasticsearch/ElasticsearchFetcher";

export interface IDataSynchronizationTaskRunnerParams {
    manager: IDataSynchronizationManager;
    indexManager: IIndexManager;
    factories: IFactories;
}

export class DataSynchronizationTaskRunner {
    private readonly manager: IDataSynchronizationManager;
    private readonly indexManager: IIndexManager;
    private readonly factories: IFactories;

    public constructor(params: IDataSynchronizationTaskRunnerParams) {
        this.manager = params.manager;
        this.indexManager = params.indexManager;
        this.factories = params.factories;
    }

    public async run(input: IDataSynchronizationInput) {
        this.validateFlow(input);
        /**
         * Go through the Elasticsearch and delete records which do not exist in the Elasticsearch table.
         */
        //
        if (input.flow === "elasticsearchToDynamoDb" && !input.elasticsearchToDynamoDb?.finished) {
            const sync = this.factories.elasticsearchToDynamoDb({
                manager: this.manager,
                indexManager: this.indexManager,
                synchronize: new ElasticsearchSynchronize({
                    context: this.manager.context,
                    timer: this.manager.timer
                }),
                fetcher: new ElasticsearchFetcher({
                    client: this.manager.elasticsearch
                })
            });
            try {
                return await sync.run(input);
            } catch (ex) {
                return this.manager.response.error(ex);
            }
        }
        /**
         * We are done.
         */
        return this.manager.response.done();
    }

    private validateFlow(input: IDataSynchronizationInput): void {
        if (!input.flow) {
            throw new Error(`Missing "flow" in the input.`);
        } else if (this.factories[input.flow]) {
            return;
        }
        throw new Error(
            `Invalid flow "${input.flow}". Allowed flows: ${Object.keys(this.factories).join(
                ", "
            )}.`
        );
    }
}
