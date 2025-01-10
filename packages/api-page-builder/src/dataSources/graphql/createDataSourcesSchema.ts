import { featureFlags } from "@webiny/feature-flags";
import { createGraphQLSchemaPlugin } from "@webiny/handler-graphql";
import { dataSourcesSchema } from "~/dataSources/graphql/schema";
import { dataSourcesResolvers } from "~/dataSources/graphql/resolvers";

export const createDataSourcesSchema = () => {
    return createGraphQLSchemaPlugin({
        typeDefs: dataSourcesSchema,
        resolvers: dataSourcesResolvers,
        isApplicable: () => {
            return featureFlags.experimentalDynamicPages === true;
        }
    });
};
