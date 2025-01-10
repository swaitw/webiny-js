import React from "react";
import { PageTemplateContentPreview } from "~/admin/views/PageTemplates/PageTemplateContentPreview";
import { DataSourceProvider, DynamicDocumentProvider } from "~/dataInjection";
import { WebsiteDataInjection } from "~/dataInjection/presets/WebsiteDataInjection";

export const PageTemplatesPreview = PageTemplateContentPreview.createDecorator(Original => {
    return function PreviewWithDynamicData(props) {
        const { template } = props;

        // TODO: maybe this logic should be in `app-dynamic-page`
        const mainDataSource = template.dataSources.find(ds => ds.name === "main");

        return (
            <>
                <WebsiteDataInjection />
                <DynamicDocumentProvider
                    dataSources={template.dataSources}
                    dataBindings={template.dataBindings}
                >
                    <DataSourceProvider dataSource={mainDataSource!}>
                        <Original {...props} />
                    </DataSourceProvider>
                </DynamicDocumentProvider>
            </>
        );
    };
});
