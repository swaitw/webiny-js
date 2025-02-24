import { ICreateMutationCb, ICreateQueryCb, MutationBody } from "../helpers/factory/types";

const ERROR_FIELDS = `
error {
    message
    code
    data
    stack
}
`;

const LOG_FIELDS = `
data {
    id
    type
    source
    data
    createdOn
}
`;

/**
 * Queries
 */
const createGetLogQuery = () => {
    return `
        query GetLog($where: GetLogWhereInput!) {
            logs {
                getLog(where: $where) {
                    ${LOG_FIELDS}
                    ${ERROR_FIELDS}
                }
            }
        }
    `;
};
const createListLogsQuery = () => {
    return `
        query ListLogs(
            $where: ListLogsWhereInput
            $sort: ListLogsSortEnum
            $limit: Int
            $after: String
        ) {
            logs {
                listLogs(where: $where, sort: $sort, limit: $limit, after: $after) {
                    ${LOG_FIELDS}
                    ${ERROR_FIELDS}
                    meta {
                        cursor
                        hasMoreItems
                        totalCount
                    }
                }
            }
        }
    `;
};
/**
 * Mutations
 */

const createDeleteLogMutation = (): MutationBody => {
    return `mutation DeleteLog($tenants: [String!]!, $item: String!) {
            logs {
                deleteLog(tenants: $tenants, item: $item) {
                    data
                    ${ERROR_FIELDS}
                }
            }
        }
    `;
};

const createDeleteLogsMutation = (): MutationBody => {
    return `mutation DeleteLog($tenants: [String!]!, $items: [String!]!) {
            logs {
                deleteLogs(tenants: $tenants, items: $items) {
                    data
                    ${ERROR_FIELDS}
                }
            }
        }
    `;
};

export interface ICreateLoggerGraphQlParams {
    createQuery: ICreateQueryCb;
    createMutation: ICreateMutationCb;
}

export const createLoggerGraphQL = (params: ICreateLoggerGraphQlParams) => {
    const { createQuery, createMutation } = params;

    return {
        /**
         * Queries
         */
        getLog: createQuery({
            query: createGetLogQuery()
        }),
        listLogs: createQuery({
            query: createListLogsQuery()
        }),
        /**
         * Mutations
         */
        deleteLog: createMutation({
            mutation: createDeleteLogMutation()
        }),
        deleteLogs: createMutation({
            mutation: createDeleteLogsMutation()
        })
    };
};
