import React, { useRef } from "react";
import { Klass, LexicalNode } from "lexical";
import { css } from "emotion";
import { CSSObject } from "@emotion/react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { allNodes } from "@webiny/lexical-nodes";
import {
    createTheme,
    EditorTheme,
    ThemeEmotionMap,
    toTypographyEmotionMap
} from "@webiny/lexical-theme";
import { isValidLexicalData } from "~/utils/isValidLexicalData";
import { generateInitialLexicalValue } from "~/utils/generateInitialLexicalValue";
import { LexicalValue } from "~/types";
import { UpdateStatePlugin } from "~/plugins/LexicalUpdateStatePlugin";
import { RichTextEditorProvider } from "~/context/RichTextEditorContext";

interface LexicalHtmlRendererProps {
    nodes?: Klass<LexicalNode>[];
    value: LexicalValue | null;
    theme: Partial<EditorTheme>;
    themeEmotionMap?: ThemeEmotionMap;
    themeStylesTransformer?: (cssObject: Record<string, any>) => CSSObject;
}

export const LexicalHtmlRenderer = ({ nodes, value, ...props }: LexicalHtmlRendererProps) => {
    const theme: EditorTheme = { styles: {}, emotionMap: {}, ...props.theme };
    const themeEmotionMap =
        props?.themeEmotionMap ?? toTypographyEmotionMap(css, theme, props.themeStylesTransformer);
    const editorTheme = useRef(createTheme(theme));
    const editorValue = isValidLexicalData(value) ? value : generateInitialLexicalValue();

    const initialConfig = {
        // We update the state via the `<LexicalUpdateStatePlugin/>`.
        editorState: null,
        namespace: "webiny",
        onError: () => {
            // Ignore errors. We don't want to break the app because of errors caused by config/value updates.
            // These are usually resolved in the next component render cycle.
        },
        editable: false,
        nodes: [...allNodes, ...(nodes || [])],
        theme: { ...editorTheme.current, emotionMap: themeEmotionMap, styles: theme.styles }
    };

    return (
        <LexicalComposer initialConfig={initialConfig} key={initialConfig.nodes.length}>
            <RichTextEditorProvider theme={theme} themeEmotionMap={themeEmotionMap}>
                <RichTextPlugin
                    contentEditable={
                        <div className="editor">
                            <ContentEditable />
                        </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                    placeholder={null}
                />
                <UpdateStatePlugin value={editorValue} />
            </RichTextEditorProvider>
        </LexicalComposer>
    );
};
