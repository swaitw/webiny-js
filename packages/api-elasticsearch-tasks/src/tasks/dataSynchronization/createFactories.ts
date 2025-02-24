import { IFactories } from "./types";
import { ElasticsearchToDynamoDbSynchronization } from "./elasticsearch/ElasticsearchToDynamoDbSynchronization";

export const createFactories = (): IFactories => {
    return {
        elasticsearchToDynamoDb: params => {
            return new ElasticsearchToDynamoDbSynchronization(params);
        }
    };
};
