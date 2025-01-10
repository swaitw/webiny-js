import React from "react";
import { Element } from "@webiny/app-page-builder-elements";
import { DataSourceProvider, useDynamicDocument } from "@webiny/app-page-builder/dataInjection";

export const AddEntriesListDataSourceContext = Element.createDecorator(Original => {
    return function WithDataSourceContext(props) {
        const { dataSources } = useDynamicDocument();

        const { element } = props;

        const renderOriginal = <Original {...props} />;

        if (!element) {
            return renderOriginal;
        }

        const isEntriesList = element.type === "entries-list";

        if (isEntriesList) {
            const dataSource = dataSources.find(source => source.name === `element:${element.id}`);

            return (
                <DataSourceProvider dataSource={dataSource!}>{renderOriginal}</DataSourceProvider>
            );
        }

        return renderOriginal;
    };
});
