import React from "react";
import { FileManager } from "~/components";
import { RichTextEditor as BaseEditor } from "@webiny/lexical-editor";
import { RichTextEditorProps } from "@webiny/lexical-editor/types";
import { useTheme } from "@webiny/app-theme";
import { EditorTheme } from "@webiny/lexical-theme";

interface LexicalEditorProps extends Omit<RichTextEditorProps, "theme"> {
    theme?: Partial<EditorTheme>;
}

const imagesOnly = ["image/*"];

export const LexicalEditor = (props: LexicalEditorProps) => {
    const { theme } = useTheme();

    const editorTheme: EditorTheme = {
        styles: {},
        emotionMap: {},
        ...theme,
        ...(props.theme || {})
    };

    return (
        <FileManager accept={imagesOnly}>
            {({ showFileManager }) => (
                <BaseEditor
                    {...props}
                    theme={editorTheme}
                    toolbarActionPlugins={[
                        ...(props.toolbarActionPlugins || []),
                        { targetAction: "image-action", plugin: showFileManager }
                    ]}
                />
            )}
        </FileManager>
    );
};
