import { createCrud, CreateCrudParams } from "./crud";
import graphql from "./graphql";
import { createTranslations, createTranslationsGraphQl } from "~/translations/createTranslations";
import { PluginCollection } from "@webiny/plugins/types";
import { createDataSourcesContext } from "~/dataSources/context/createDataSourcesContext";
import { createDataSourcesSchema } from "~/dataSources/graphql/createDataSourcesSchema";

export const createPageBuilderGraphQL = (): PluginCollection => {
    return [...graphql(), ...createTranslationsGraphQl(), createDataSourcesSchema()];
};

export type ContextParams = CreateCrudParams;
export const createPageBuilderContext = (params: ContextParams) => {
    return [createCrud(params), ...createTranslations(), createDataSourcesContext()];
};

export * from "./crud/pages/PageContent";
export * from "./crud/pages/PageElementId";
