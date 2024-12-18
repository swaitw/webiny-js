import type { DecoratorsCollection } from "@webiny/app";
import { ParagraphRenderer } from "@webiny/app-page-builder-elements/renderers/paragraph";
import { HeadingRenderer } from "@webiny/app-page-builder-elements/renderers/heading";
import { LexicalParagraphDecorator } from "~/render/plugins/elements/paragraph/LexicalParagraph";
import { LexicalHeadingDecorator } from "~/render/plugins/elements/heading/LexicalHeading";

export const lexicalRendererDecorators: DecoratorsCollection = [
    [ParagraphRenderer.Component, [LexicalParagraphDecorator]],
    [HeadingRenderer.Component, [LexicalHeadingDecorator]]
];
