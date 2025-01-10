import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { useModel } from "@webiny/app-headless-cms";
import { ContentEntryEditorConfig } from "@webiny/app-headless-cms";
import { useListPageTemplates } from "@webiny/app-page-builder/features";
import { PreviewPane } from "~/admin/ContentEntryForm/PreviewPane";

const { ContentEntry } = ContentEntryEditorConfig;

const SplitView = styled.div`
    display: flex;
    > div {
        flex: 1;
    }
`;

export const AddPreviewPane = ContentEntry.ContentEntryForm.createDecorator(Original => {
    return function ContentEntryForm(props) {
        const { model } = useModel();

        const { pageTemplates } = useListPageTemplates();

        const modelTemplate = useMemo(() => {
            return pageTemplates.find(template =>
                template.dataSources.some(ds => {
                    return ds.name === "main" && ds.config.modelId === model.modelId;
                })
            );
        }, [pageTemplates]);

        if (!modelTemplate) {
            return <Original {...props} />;
        }

        return (
            <SplitView>
                <PreviewPane template={modelTemplate} />
                <div>
                    <Original {...props} />
                </div>
            </SplitView>
        );
    };
});
