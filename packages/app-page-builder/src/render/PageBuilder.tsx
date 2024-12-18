import React from "react";
import { AddButtonClickHandlers } from "~/elementDecorators/AddButtonClickHandlers";
import { AddButtonLinkComponent } from "~/elementDecorators/AddButtonLinkComponent";
import { InjectElementVariables } from "~/render/variables/InjectElementVariables";
import { LexicalParagraphRenderer } from "~/render/plugins/elements/paragraph/LexicalParagraph";
import { LexicalHeadingRenderer } from "~/render/plugins/elements/heading/LexicalHeading";
import { ConvertIconSettings } from "~/render/plugins/elementSettings/icon";

export const PageBuilder = React.memo(() => {
    return (
        <>
            <AddButtonLinkComponent />
            <AddButtonClickHandlers />
            <InjectElementVariables />
            <LexicalParagraphRenderer />
            <LexicalHeadingRenderer />
            <ConvertIconSettings />
        </>
    );
});

PageBuilder.displayName = "PageBuilder";
