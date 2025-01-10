import { ITaskResponse, ITaskResponseResult } from "@webiny/tasks";
import { IPruneLogsInput, IPruneLogsOutput } from "~/tasks/pruneLogs/types";
import { create } from "~/db";
import { ILoggerCrudListLogsCallable, ILoggerCrudListLogsResponse, ILoggerLog } from "~/types";
import { batchWriteAll } from "@webiny/db-dynamodb";
import { DynamoDbLoggerKeys } from "~/logger";
import { DynamoDBDocument } from "@webiny/aws-sdk/client-dynamodb";

const getDate = (input: string | undefined, reduceSeconds = 60): Date => {
    if (input) {
        return new Date(input);
    }
    const current = new Date().getTime();
    const next = current - reduceSeconds * 1000;
    return new Date(next);
};

export interface IPruneLogsParams {
    documentClient: DynamoDBDocument;
    keys: DynamoDbLoggerKeys;
}

export interface IPruneLogsExecuteParams<
    I extends IPruneLogsInput = IPruneLogsInput,
    O extends IPruneLogsOutput = IPruneLogsOutput
> {
    list: ILoggerCrudListLogsCallable;
    input: I;
    response: ITaskResponse<I, O>;
    isAborted: () => boolean;
    isCloseToTimeout: () => boolean;
}

export class PruneLogs<
    I extends IPruneLogsInput = IPruneLogsInput,
    O extends IPruneLogsOutput = IPruneLogsOutput
> {
    private readonly documentClient: DynamoDBDocument;
    private readonly keys: DynamoDbLoggerKeys;

    public constructor(params: IPruneLogsParams) {
        this.documentClient = params.documentClient;
        this.keys = params.keys;
    }

    public async execute(params: IPruneLogsExecuteParams<I, O>): Promise<ITaskResponseResult> {
        const { list, response, input, isAborted, isCloseToTimeout } = params;

        const { entity, table } = create({
            documentClient: this.documentClient
        });

        let startKey = input.keys || undefined;

        const createdAfter = getDate(input.createdAfter);

        let totalItems = input.items || 0;

        const filter = (item: Pick<ILoggerLog, "createdOn" | "source" | "type">): boolean => {
            /**
             * We always check the date first. We do not need to go any further if the date is not older than the provided date.
             */
            const date = new Date(item.createdOn);
            const isDeletable = date.getTime() <= createdAfter.getTime();
            if (!isDeletable || (!input.source && !input.type)) {
                return isDeletable;
            } else if (input.source && input.type) {
                return (input.source === item.source && input.type === item.type) || isDeletable;
            } else if (input.source) {
                return input.source === item.source || isDeletable;
            }
            return input.type === item.type || isDeletable;
        };

        let result: ILoggerCrudListLogsResponse;
        do {
            if (isAborted()) {
                return response.aborted();
            } else if (isCloseToTimeout()) {
                const inputOutput: IPruneLogsInput = {
                    ...input,
                    createdAfter: createdAfter.toISOString(),
                    items: totalItems,
                    keys: startKey
                };
                return response.continue(inputOutput as I);
            }
            result = await list({
                where: {
                    tenant: input.tenant,
                    source: input.source,
                    type: input.type
                },
                limit: 100
            });

            const items = result.items.filter(filter);

            if (items.length > 0) {
                await batchWriteAll({
                    items: result.items.map(item => {
                        return entity.deleteBatch({
                            PK: this.keys.createPartitionKey(),
                            SK: this.keys.createSortKey(item)
                        });
                    }),
                    table
                });
                totalItems += items.length;
            }

            if (result?.meta?.hasMoreItems) {
                startKey = result.meta.cursor || undefined;
            }
        } while (startKey);
        const output: IPruneLogsOutput = {
            items: totalItems
        };
        return response.done(output as O);
    }
}
