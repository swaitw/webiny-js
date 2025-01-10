import React from "react";
import { useTemplate, TemplateEditorConfig } from "~/templateEditor";
import { DynamicDocumentProvider } from "~/dataInjection";
import { PbDataBinding, PbDataSource } from "~/types";

const { Ui } = TemplateEditorConfig;

export const SetupDynamicDocument = Ui.Layout.createDecorator(Original => {
    return function TemplateToDynamicDocument() {
        const [template, updateTemplate] = useTemplate();

        const onDataSources = (dataSources: PbDataSource[]) => {
            updateTemplate(template => ({ ...template, dataSources }));
        };

        const onDataBindings = (dataBindings: PbDataBinding[]) => {
            updateTemplate(template => ({ ...template, dataBindings }));
        };

        return (
            <DynamicDocumentProvider
                dataSources={template.dataSources}
                dataBindings={template.dataBindings}
                onDataSources={onDataSources}
                onDataBindings={onDataBindings}
            >
                <Original />
            </DynamicDocumentProvider>
        );
    };
});
