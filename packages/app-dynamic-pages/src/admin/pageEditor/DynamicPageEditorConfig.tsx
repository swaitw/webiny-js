import React from "react";
import { PageEditorConfig } from "@webiny/app-page-builder/pageEditor";
import { ElementEventHandlers } from "./ElementEventHandlers";
import { SetupElementDataSettings } from "~/dataInjection/editor/SetupElementDataSettings";
import { AddEntriesListDataSourceContext } from "~/dataInjection/AddEntriesListDataSourceContext";

export const DynamicPageEditorConfig = () => {
    return (
        <>
            <PageEditorConfig>
                <AddEntriesListDataSourceContext />
                <ElementEventHandlers />
                <SetupElementDataSettings />
            </PageEditorConfig>
        </>
    );
};
