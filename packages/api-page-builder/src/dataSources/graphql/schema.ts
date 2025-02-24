export const dataSourcesSchema = /* GraphQL */ `
    type DataSourceError {
        code: String
        message: String
        data: JSON
        stack: String
    }

    type DataSourceResponse {
        data: JSON
        error: DataSourceError
    }

    type DataSourcesQuery {
        loadDataSource(type: String!, config: JSON!, paths: [String!]): DataSourceResponse
    }

    extend type Query {
        dataSources: DataSourcesQuery
    }
`;
