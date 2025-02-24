import React from "react";
import { PageTemplateDialog } from "~/admin/PageTemplateDialog/PageTemplateDialog";
import { DynamicTemplateEditorConfig } from "~/admin/templateEditor/DynamicTemplateEditorConfig";
import { AddPreviewPane } from "~/admin/ContentEntryForm/AddPreviewPane";
import { PassEntryToDataSource } from "~/admin/ContentEntryForm/PassEntryToDataSource";
import { Elements } from "~/admin/elements/Elements";
import { DynamicPageEditorConfig } from "~/admin/pageEditor/DynamicPageEditorConfig";
import { DynamicElementRenderers } from "~/dataInjection/renderers/DynamicElementRenderers";
import { ContentEntryEditorConfig } from "@webiny/app-headless-cms";
import { WebsiteDataInjection } from "@webiny/app-page-builder/dataInjection/presets/WebsiteDataInjection";
import { AddEntriesListDataSourceContext } from "~/dataInjection/AddEntriesListDataSourceContext";

export const SetupDynamicPages = () => {
    return (
        <>
            {/* Register editor elements plugins. */}
            <Elements />

            {/* Decorate page template dialog. */}
            <PageTemplateDialog />

            {/* Configure Template editor. */}
            <DynamicTemplateEditorConfig />

            {/* Configure Page editor. */}
            <DynamicPageEditorConfig />

            {/* Enable live preview in the CMS entry form. */}
            <AddPreviewPane />

            <PassEntryToDataSource />

            {/* Register element renderers and decorators. */}
            <DynamicElementRenderers />

            {/* Add website-style data binding to page preview. */}
            <ContentEntryEditorConfig>
                <WebsiteDataInjection />
                <AddEntriesListDataSourceContext />
            </ContentEntryEditorConfig>
        </>
    );
};
