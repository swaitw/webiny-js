import React from "react";
import { PageEditorConfig } from "~/pageEditor";
import { DynamicDocumentProvider } from "~/dataInjection";
import { usePage } from "~/pageEditor";
import { PbDataBinding, PbDataSource } from "~/types";
import { useEventActionHandler } from "~/editor";
import { UpdateDocumentActionEvent } from "~/editor/recoil/actions";

const { Ui } = PageEditorConfig;

export const SetupDynamicDocument = Ui.Layout.createDecorator(Original => {
    return function PageToDynamicDocument() {
        const eventActionHandler = useEventActionHandler();
        const [page, updatePage] = usePage();

        const onDataSources = (dataSources: PbDataSource[]) => {
            updatePage(page => ({ ...page, dataSources }));
            eventActionHandler.trigger(
                new UpdateDocumentActionEvent({
                    history: false,
                    document: {
                        dataSources
                    }
                })
            );
        };

        const onDataBindings = (dataBindings: PbDataBinding[]) => {
            updatePage(page => ({ ...page, dataBindings }));
            eventActionHandler.trigger(
                new UpdateDocumentActionEvent({
                    history: false,
                    document: {
                        dataBindings
                    }
                })
            );
        };

        return (
            <DynamicDocumentProvider
                dataSources={page.dataSources || []}
                dataBindings={page.dataBindings || []}
                onDataSources={onDataSources}
                onDataBindings={onDataBindings}
            >
                <Original />
            </DynamicDocumentProvider>
        );
    };
});
