import { createBaseGraphQL } from "./graphql/base.gql";
import { createMenuGraphQL } from "./graphql/menus.gql";
import { createPageGraphQL } from "./graphql/pages.gql";
import { createPageElementsGraphQL } from "./graphql/pageElements.gql";
import { createCategoryGraphQL } from "./graphql/categories.gql";
import { createSettingsGraphQL } from "./graphql/settings.gql";
import { createInstallGraphQL } from "./graphql/install.gql";
import { createBlockCategoryGraphQL } from "./graphql/blockCategories.gql";
import { createPageBlockGraphQL } from "./graphql/pageBlocks.gql";
import { createPageTemplateGraphQL } from "./graphql/pageTemplates.gql";

import { GraphQLSchemaPlugin } from "@webiny/handler-graphql/types";
import { createDynamicDataSchema } from "~/graphql/graphql/dynamicData.gql";

export default () => {
    return [
        createBaseGraphQL(),
        createDynamicDataSchema(),
        createMenuGraphQL(),
        createCategoryGraphQL(),
        createPageGraphQL(),
        createPageElementsGraphQL(),
        createSettingsGraphQL(),
        createBlockCategoryGraphQL(),
        createInstallGraphQL(),
        createPageBlockGraphQL,
        createPageTemplateGraphQL
    ] as GraphQLSchemaPlugin[];
};
