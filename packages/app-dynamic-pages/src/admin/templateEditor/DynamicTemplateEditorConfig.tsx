import React from "react";
import { TemplateEditorConfig } from "@webiny/app-page-builder/templateEditor";
import { EntrySelector } from "~/admin/templateEditor/EntrySelector";
import { hasMainDataSource } from "~/features";
import { ElementEventHandlers } from "./ElementEventHandlers";
import { useDynamicDocument } from "@webiny/app-page-builder/dataInjection";
import { SetupElementDataSettings } from "~/dataInjection/editor/SetupElementDataSettings";
import { AddEntriesListDataSourceContext } from "~/dataInjection/AddEntriesListDataSourceContext";

const { Ui } = TemplateEditorConfig;

const OnDynamicTemplate = ({ children }: { children: React.ReactNode }) => {
    const { dataSources } = useDynamicDocument();

    return hasMainDataSource(dataSources) ? <>{children}</> : null;
};

export const DynamicTemplateEditorConfig = () => {
    return (
        <>
            <TemplateEditorConfig>
                <AddEntriesListDataSourceContext />
                <SetupElementDataSettings />
                <Ui.TopBar.Element
                    name={"entrySelector"}
                    element={
                        <OnDynamicTemplate>
                            <EntrySelector />
                        </OnDynamicTemplate>
                    }
                    group={"center"}
                />

                <ElementEventHandlers />
            </TemplateEditorConfig>
        </>
    );
};
