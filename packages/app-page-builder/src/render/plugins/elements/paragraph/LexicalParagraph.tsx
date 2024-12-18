import React from "react";
import {
    elementInputs,
    ParagraphRenderer
} from "@webiny/app-page-builder-elements/renderers/paragraph";
import { usePageElements, useRenderer } from "@webiny/app-page-builder-elements";
import { assignStyles } from "@webiny/app-page-builder-elements/utils";
import { isValidLexicalData, LexicalHtmlRenderer } from "@webiny/lexical-editor";
import type { ComponentDecorator } from "@webiny/app";
import type { Renderer } from "@webiny/app-page-builder-elements/types";

export const LexicalParagraphDecorator: ComponentDecorator<Renderer> = Original => {
    return function LexicalParagraphRenderer(props) {
        const { theme } = usePageElements();
        const { getInputValues } = useRenderer();
        const inputs = getInputValues<typeof elementInputs>();
        const __html = inputs.text || "";

        if (isValidLexicalData(__html)) {
            return (
                <LexicalHtmlRenderer
                    theme={theme}
                    themeStylesTransformer={styles => {
                        return assignStyles({
                            breakpoints: theme.breakpoints,
                            styles
                        });
                    }}
                    value={__html || ""}
                />
            );
        }

        return <Original {...props} />;
    };
};

export const LexicalParagraphRenderer =
    ParagraphRenderer.Component.createDecorator(LexicalParagraphDecorator);
