import type ApolloClient from "apollo-client";
import gql from "graphql-tag";
import { GenericRecord } from "@webiny/app/types";
import { WebinyError } from "@webiny/error";
import { IResolveDataSourceGateway } from "./IResolveDataSourceGateway";
import { DataRequest, DataSourceData } from "./IResolveDataSourceRepository";

const LOAD_DATA_SOURCE = gql`
    query LoadDataSource($type: String!, $config: JSON!, $paths: [String!]) {
        dataSources {
            loadDataSource(type: $type, config: $config, paths: $paths) {
                data
                error {
                    code
                    message
                    data
                }
            }
        }
    }
`;

interface QueryType {
    dataSources: {
        loadDataSource:
            | {
                  data: DataSourceData;
                  error: undefined;
              }
            | {
                  data: undefined;
                  error: {
                      code: string;
                      message: string;
                      data: GenericRecord<string>;
                  };
              };
    };
}

interface QueryVariables {
    type: string;
    config: GenericRecord<string>;
    paths: string[];
}

export class ResolveDataSourceGqlGateway implements IResolveDataSourceGateway {
    private client: ApolloClient<any>;

    constructor(client: ApolloClient<any>) {
        this.client = client;
    }

    async execute(request: DataRequest): Promise<DataSourceData> {
        const query = await this.client.query<QueryType, QueryVariables>({
            query: LOAD_DATA_SOURCE,
            fetchPolicy: "no-cache",
            variables: {
                type: request.getType(),
                config: request.getConfig(),
                paths: request.getPaths()
            }
        });

        if (query.errors) {
            throw new WebinyError(query.errors[0].message);
        }

        if (!query.data) {
            throw new WebinyError(`No data was returned from "loadOne" query!`);
        }

        const { data, error } = query.data.dataSources.loadDataSource;

        if (!data) {
            throw new WebinyError(error);
        }

        return data;
    }
}
