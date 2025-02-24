import { GraphQLSchemaPlugin } from "@webiny/handler-graphql";

export const createDynamicDataSchema = () => {
    return new GraphQLSchemaPlugin({
        typeDefs: /* GraphQL */ `
            type DataSource {
                name: String!
                type: String!
                config: JSON!
            }

            type DataBinding {
                dataSource: String
                bindFrom: String
                bindTo: String
            }

            input DataBindingInput {
                dataSource: String!
                bindFrom: String!
                bindTo: String!
            }

            input DataSourceInput {
                name: String!
                type: String!
                config: JSON!
            }
        `
    });
};
