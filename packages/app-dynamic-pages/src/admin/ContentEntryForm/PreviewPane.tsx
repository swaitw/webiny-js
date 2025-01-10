import React from "react";
import styled from "@emotion/styled";
import { PbPageTemplateWithContent } from "@webiny/app-page-builder/types";
import { RenderPluginsLoader } from "@webiny/app-page-builder/admin";
import { Content } from "@webiny/app-page-builder-elements";
import {
    DataSourceProvider,
    DynamicDocumentProvider
} from "@webiny/app-page-builder/dataInjection";
import { RefreshIcon } from "@webiny/ui/List/DataList/icons";
import { useRefreshPageTemplates } from "@webiny/app-page-builder/features";

const LivePreviewContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--mdc-theme-on-background);
    height: calc(100vh - 260px);
    overflow: auto;
`;

const Header = styled.div`
    display: flex;
    padding: 15px;
    justify-content: space-between;
    border-bottom: 1px solid var(--mdc-theme-on-background);
    font-size: 24px;
    align-items: center;
`;

export interface PreviewPaneProps {
    template: PbPageTemplateWithContent;
}

export const PreviewPane = ({ template }: PreviewPaneProps) => {
    const mainDataSource = template.dataSources.find(ds => ds.name === "main");
    const { refreshPageTemplates } = useRefreshPageTemplates();

    return (
        <RenderPluginsLoader>
            <LivePreviewContainer>
                <Header>
                    {template.title}
                    <RefreshIcon onClick={() => refreshPageTemplates()} />
                </Header>
                <DynamicDocumentProvider
                    dataSources={template.dataSources}
                    dataBindings={template.dataBindings}
                >
                    <DataSourceProvider dataSource={mainDataSource!}>
                        <Content content={template.content} />
                    </DataSourceProvider>
                </DynamicDocumentProvider>
            </LivePreviewContainer>
        </RenderPluginsLoader>
    );
};
