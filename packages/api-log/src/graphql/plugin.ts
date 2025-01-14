import { GraphQLSchemaPlugin, resolve, resolveList } from "@webiny/handler-graphql";
import { Context, LogType } from "~/types";
import zod from "zod";
import { createZodError } from "@webiny/utils";

export const emptyResolver = () => ({});

const getLogArgsSchema = zod.object({
    where: zod.object({
        id: zod.string()
    })
});

const listLogsArgsSchema = zod.object({
    where: zod
        .object({
            tenant: zod.string().optional(),
            source: zod.string().optional(),
            type: zod
                .enum([LogType.DEBUG, LogType.NOTICE, LogType.INFO, LogType.WARN, LogType.ERROR])
                .optional()
        })
        .optional(),
    sort: zod.array(zod.enum(["ASC", "DESC"])).optional(),
    limit: zod.number().optional(),
    after: zod.string().optional()
});

const deleteLogArgsSchema = zod.object({
    where: zod.object({
        tenant: zod.string().optional(),
        id: zod.string()
    })
});

const deleteLogsArgsSchema = zod.object({
    where: zod.object({
        tenant: zod.string().optional(),
        items: zod.array(zod.string())
    })
});

export const createGraphQlPlugin = () => {
    return new GraphQLSchemaPlugin<Context>({
        typeDefs: /* GraphQL */ `
            type LogsQuery {
                _empty: String
            }
            
            type LogsMutation {
                _empty: String
            }

            extend type Query {
                logs: LogsQuery
            }

            extend type Mutation {
                logs: LogsMutation
            }
            
            enum LogType {
                ${LogType.DEBUG}
                ${LogType.NOTICE}
                ${LogType.INFO}
                ${LogType.WARN}
                ${LogType.ERROR}
            }

            type LogQueryResponseItem {
                id: ID!
                type: LogType!
                source: String!
                data: JSON!
                createdOn: DateTime!
            }

            type LogQueryGetResponse {
                data: LogQueryResponseItem
                error: LogQueryResponseError
            }

            type LogQueryListResponseMeta {
                cursor: String
                hasMoreItems: Boolean!
                totalCount: Int!
            }

            type LogQueryResponseError {
                message: String!
                code: String
                data: JSON
                stack: String
            }

            type LogQueryListResponse {
                data: [LogQueryResponseItem!]
                meta: LogQueryListResponseMeta
                error: LogQueryResponseError
            }

            input ListLogsWhereInput {
                tenant: String
                source: String
                type: LogType
            }
            
            input GetLogWhereInput {
                id: ID!
            }

            enum ListLogsSortEnum {
                ASC
                DESC
            }

            extend type LogsQuery {
                getLog(where: GetLogWhereInput!): LogQueryGetResponse!
                listLogs(
                    where: ListLogsWhereInput
                    sort: ListLogsSortEnum
                    limit: Int
                    after: String
                ): LogQueryListResponse!
            }

            type LogMutationDeleteLogResponse {
                data: LogQueryResponseItem
                error: LogQueryResponseError
            }

            type LogMutationDeleteLogsResponse {
                data: Int
                error: LogQueryResponseError
            }

            type LogMutationPruneLogsResponseDataTask {
                id: ID!
            }
            
            type LogMutationPruneLogsResponseData {
                task: LogMutationPruneLogsResponseDataTask!
            }

            type LogMutationPruneLogsResponse {
                data: LogMutationPruneLogsResponseData
                error: LogQueryResponseError
            }

            input DeleteLogWhereInput {
                id: ID!
            }

            input DeleteLogsWhereInput {
                items: [ID!]!
            }

            extend type LogsMutation {
                pruneLogs: LogMutationPruneLogsResponse!
                deleteLog(where: DeleteLogWhereInput!): LogMutationDeleteLogResponse!
                deleteLogs(where: DeleteLogsWhereInput!): LogMutationDeleteLogsResponse!
            }
        `,
        resolvers: {
            Query: {
                logs: emptyResolver
            },
            Mutation: {
                logs: emptyResolver
            },
            LogsQuery: {
                getLog: async (_: unknown, args: unknown, context) => {
                    return resolve(async () => {
                        const result = getLogArgsSchema.safeParse(args);
                        if (result.error) {
                            throw createZodError(result.error);
                        }
                        return await context.logger.getLog(result.data);
                    });
                },
                listLogs: async (_, args, context) => {
                    return resolveList(async () => {
                        const result = listLogsArgsSchema.safeParse(args);
                        if (result.error) {
                            throw createZodError(result.error);
                        }
                        return await context.logger.listLogs(result.data);
                    });
                }
            },
            LogsMutation: {
                deleteLog: async (_, args, context) => {
                    return resolve(async () => {
                        const result = deleteLogArgsSchema.safeParse(args);
                        if (result.error) {
                            throw createZodError(result.error);
                        }
                        return await context.logger.deleteLog(result.data);
                    });
                },
                deleteLogs: async (_, args, context) => {
                    return resolve(async () => {
                        const result = deleteLogsArgsSchema.safeParse(args);
                        if (result.error) {
                            throw createZodError(result.error);
                        }
                        return await context.logger.deleteLogs(result.data);
                    });
                },
                pruneLogs: async (_: unknown, __: unknown, context) => {
                    return resolve(async () => {
                        return await context.logger.pruneLogs();
                    });
                }
            }
        }
    });
};
