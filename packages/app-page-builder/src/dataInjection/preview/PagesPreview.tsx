import React from "react";
import { PageContentPreview } from "~/admin/plugins/pageDetails/previewContent/PageContentPreview";
import { DynamicDocumentProvider } from "~/dataInjection";
import { WebsiteDataInjection } from "~/dataInjection/presets/WebsiteDataInjection";

export const PagesPreview = PageContentPreview.createDecorator(Original => {
    return function PreviewWithDynamicData(props) {
        return (
            <>
                <WebsiteDataInjection />
                <DynamicDocumentProvider
                    dataSources={props.page.dataSources || []}
                    dataBindings={props.page.dataBindings || []}
                >
                    <Original {...props} />
                </DynamicDocumentProvider>
            </>
        );
    };
});
