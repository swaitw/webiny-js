import React, { useState } from "react";
import { createPortal } from "react-dom";
import { CircularProgress } from "@webiny/ui/Progress";
import { useContentEntry } from "~/admin/views/contentEntries/hooks";
import { RevisionListDrawer } from "./RevisionListDrawer";
import { FullScreenContentEntryHeaderLeft } from "./FullScreenContentEntryHeaderLeft";
import {
    FullScreenContentEntryContainer,
    FullScreenContentEntryContent,
    FullScreenContentEntryContentFormInner,
    FullScreenContentEntryContentFormInnerCss,
    FullScreenContentEntryContentFormWrapper,
    FullScreenContentEntryHeader,
    FullScreenContentEntryHeaderContent
} from "./FullScreenContentEntry.styled";
import { FullScreenContentEntryProvider } from "./useFullScreenContentEntry";
import { ContentEntryEditorConfig } from "~/ContentEntryEditorConfig";
import { cmsLegacyEntryEditor } from "~/utils/cmsLegacyEntryEditor";

const { ContentEntry } = ContentEntryEditorConfig;

const FullScreenContentEntryDecorator = ContentEntry.createDecorator(Original => {
    return function ContentEntry() {
        const { loading } = useContentEntry();
        const [isRevisionListOpen, openRevisionList] = useState<boolean>(false);

        return (
            <FullScreenContentEntryProvider
                openRevisionList={openRevisionList}
                isRevisionListOpen={isRevisionListOpen}
            >
                <FullScreenContentEntryContainer>
                    <FullScreenContentEntryHeader>
                        <FullScreenContentEntryHeaderContent style={{ width: "33%" }}>
                            <FullScreenContentEntryHeaderLeft />
                        </FullScreenContentEntryHeaderContent>
                        <FullScreenContentEntryHeaderContent>
                            {/*
                                Empty div to relocate Entry Form Header via React Portal in full-screen mode.
                                Ensures layout flexibility without disrupting React context and state.
                            */}
                            <div id={"cms-content-entry-header-right"} />
                        </FullScreenContentEntryHeaderContent>
                    </FullScreenContentEntryHeader>
                    {loading && <CircularProgress style={{ zIndex: 10 }} />}
                    <FullScreenContentEntryContent>
                        <FullScreenContentEntryContentFormWrapper>
                            <FullScreenContentEntryContentFormInner>
                                <Original />
                            </FullScreenContentEntryContentFormInner>
                        </FullScreenContentEntryContentFormWrapper>
                    </FullScreenContentEntryContent>
                    <RevisionListDrawer />
                </FullScreenContentEntryContainer>
            </FullScreenContentEntryProvider>
        );
    };
});

const FullScreenContentEntryFormDecorator = ContentEntry.ContentEntryForm.createDecorator(
    Original => {
        return function ContentEntryForm(props) {
            return <Original {...props} className={FullScreenContentEntryContentFormInnerCss} />;
        };
    }
);

const FullScreenContentEntryFormHeaderDecorator =
    ContentEntry.ContentEntryForm.Header.createDecorator(Original => {
        return function ContentEntryFormHeader() {
            const headerRightElement = document.getElementById("cms-content-entry-header-right");

            if (!headerRightElement) {
                return <Original />;
            }

            return createPortal(<Original />, headerRightElement);
        };
    });

export const FullScreenContentEntry = () => {
    if (cmsLegacyEntryEditor) {
        return null;
    }

    return (
        <>
            <FullScreenContentEntryDecorator />
            <FullScreenContentEntryFormDecorator />
            <FullScreenContentEntryFormHeaderDecorator />
        </>
    );
};
