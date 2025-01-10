import { ErrorResponse, Response } from "@webiny/handler-graphql";
import type { Resolvers } from "@webiny/handler-graphql/types";
import type { DataSourcesContext } from "~/dataSources/types";
import { DataLoaderRequest } from "~/dataSources";

export const dataSourcesResolvers: Resolvers<DataSourcesContext> = {
    Query: {
        dataSources: () => ({})
    },
    DataSourcesQuery: {
        loadDataSource: async (_, args, context) => {
            const loader = context.dataSources.getLoader();

            try {
                const data = await loader.load(
                    DataLoaderRequest.create({
                        type: args.type,
                        config: args.config,
                        paths: args.paths || []
                    })
                );

                if (data === undefined) {
                    return new ErrorResponse({
                        code: "NO_APPLICABLE_DATA_SOURCES",
                        message: "No data sources were able to handle the request!"
                    });
                }

                return new Response(data);
            } catch (e) {
                if (e.code === "VALIDATION_FAILED_INVALID_FIELDS") {
                    return new ErrorResponse({
                        code: "DATA_SOURCE_CONFIG_VALIDATION",
                        message: "Data source config is invalid.",
                        data: e.data
                    });
                }
                return new ErrorResponse(e);
            }
        }
    }
};
