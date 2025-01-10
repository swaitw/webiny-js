import { createContextPlugin } from "@webiny/api";
import type { PbContext } from "~/graphql/types";
import { DataSourcesContext } from "./DataSourcesContext";
import { CmsEntryDataSource } from "~/dataSources/cmsDataSources/CmsEntryDataSource";
import { CmsEntriesDataSource } from "~/dataSources/cmsDataSources/CmsEntriesDataSource";

export const createDataSourcesContext = () => {
    return createContextPlugin<PbContext>(context => {
        context.dataSources = new DataSourcesContext();

        context.dataSources.addDataSource(new CmsEntryDataSource(context.cms));
        context.dataSources.addDataSource(new CmsEntriesDataSource(context.cms));
    });
};
