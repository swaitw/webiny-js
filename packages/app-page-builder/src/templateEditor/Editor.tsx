import React from "react";
import { plugins } from "@webiny/plugins";
import { useRouter } from "@webiny/react-router";
import { Editor as PbEditor } from "~/admin/components/Editor";

import { EditorLoadingScreen } from "~/admin/components/EditorLoadingScreen";
import { createStateInitializer } from "./createStateInitializer";
import { DefaultEditorConfig } from "~/editor/defaultConfig/DefaultEditorConfig";
import { DefaultTemplateEditorConfig } from "./config/DefaultTemplateEditorConfig";
import elementVariableRendererPlugins from "~/blockEditor/plugins/elementVariables";
import { usePrepareEditor } from "~/templateEditor/usePrepareEditor";

export const TemplateEditor = () => {
    plugins.register(elementVariableRendererPlugins());

    const { params } = useRouter();
    const templateId = decodeURIComponent(params["id"]);
    const template = usePrepareEditor(templateId);

    return (
        <>
            <DefaultEditorConfig />
            <DefaultTemplateEditorConfig />
            {template ? (
                <PbEditor stateInitializerFactory={createStateInitializer(template)} />
            ) : (
                <EditorLoadingScreen />
            )}
        </>
    );
};
