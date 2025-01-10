import { batchReadAll } from "@webiny/db-dynamodb";
import { createSynchronizationBuilder } from "@webiny/api-dynamodb-to-elasticsearch";
import {
    getElasticsearchEntity,
    getElasticsearchEntityType,
    getTable,
    IGetElasticsearchEntityTypeParams
} from "~/tasks/dataSynchronization/entities";
import { ITimer } from "@webiny/handler-aws";
import { Context } from "~/types";
import {
    IElasticsearchSynchronize,
    IElasticsearchSynchronizeExecuteParams,
    IElasticsearchSynchronizeExecuteResponse
} from "./abstractions/ElasticsearchSynchronize";

export interface IElasticsearchSynchronizeParams {
    timer: ITimer;
    context: Context;
}

interface IDynamoDbItem {
    PK: string;
    SK: string;
}

export class ElasticsearchSynchronize implements IElasticsearchSynchronize {
    private readonly timer: ITimer;
    private readonly context: Context;

    public constructor(params: IElasticsearchSynchronizeParams) {
        this.timer = params.timer;
        this.context = params.context;
    }

    public async execute(
        params: IElasticsearchSynchronizeExecuteParams
    ): Promise<IElasticsearchSynchronizeExecuteResponse> {
        const { items, done, index } = params;
        if (items.length === 0) {
            return {
                done: true
            };
        }

        const table = getTable({
            type: "es",
            context: this.context
        });

        const readableItems = items.map(item => {
            const entity = this.getEntity(item);
            return entity.item.getBatch({
                PK: item.PK,
                SK: item.SK
            });
        });

        const tableItems = await batchReadAll<IDynamoDbItem>({
            items: readableItems,
            table
        });

        const elasticsearchSyncBuilder = createSynchronizationBuilder({
            timer: this.timer,
            context: this.context
        });
        /**
         * We need to find the items we have in the Elasticsearch but not in the DynamoDB-Elasticsearch table.
         */
        for (const item of items) {
            const exists = tableItems.some(ddbItem => {
                return ddbItem.PK === item.PK && ddbItem.SK === item.SK;
            });
            if (exists) {
                continue;
            }
            elasticsearchSyncBuilder.delete({
                index,
                id: item._id
            });
        }

        const executeWithRetry = elasticsearchSyncBuilder.build();
        await executeWithRetry();

        return {
            done
        };
    }

    private getEntity(
        params: IGetElasticsearchEntityTypeParams
    ): ReturnType<typeof getElasticsearchEntity> {
        const type = getElasticsearchEntityType(params);
        return getElasticsearchEntity({
            type,
            context: this.context
        });
    }
}
