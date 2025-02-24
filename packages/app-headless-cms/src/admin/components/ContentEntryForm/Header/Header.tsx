import React from "react";
import { Buttons, makeDecoratable } from "@webiny/app-admin";

import { useContentEntryEditorConfig } from "~/admin/config/contentEntries";

import { ContentFormOptionsMenu } from "./ContentFormOptionsMenu";
import { RevisionSelector } from "~/admin/components/ContentEntryForm/Header/RevisionSelector";
import styled from "@emotion/styled";

const ToolbarGrid = styled.div`
    padding: 15px;
    border-bottom: 1px solid var(--mdc-theme-on-background);
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Actions = styled.div`
    display: flex;
    align-items: center;
`;

export const Header = makeDecoratable("ContentEntryFormHeader", () => {
    const { buttonActions } = useContentEntryEditorConfig();

    return (
        <ToolbarGrid id="headerToolbarGrid">
            <div>
                <RevisionSelector />
            </div>
            <Actions>
                <Buttons actions={buttonActions} />
                <ContentFormOptionsMenu />
            </Actions>
        </ToolbarGrid>
    );
});
