import React from "react";
import { css } from "emotion";
import { makeDecoratable } from "@webiny/app";
import { Content } from "@webiny/app-page-builder-elements";
import type { PbPageTemplateWithContent } from "~/types";

const pageInnerWrapper = css`
    overflow-y: scroll;
    overflow-x: hidden;
    height: calc(100vh - 165px);
`;

interface PageTemplateContentPreviewProps {
    template: PbPageTemplateWithContent;
}

export const PageTemplateContentPreview = makeDecoratable(
    "PageTemplateContentPreview",
    ({ template }: PageTemplateContentPreviewProps) => {
        return (
            <div className={pageInnerWrapper}>
                <Content content={template.content} />
            </div>
        );
    }
);
