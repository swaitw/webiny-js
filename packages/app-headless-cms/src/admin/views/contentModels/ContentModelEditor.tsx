import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { ContentModelEditor } from "~/admin/components/ContentModelEditor/ContentModelEditor";
import { useRouter } from "@webiny/react-router";
import { useCms } from "~/admin/hooks";
import { ContentModelEditorProvider } from "~/admin/components/ContentModelEditor";

const ContentModelEditorView = () => {
    const { params } = useRouter();
    const { apolloClient } = useCms();

    const modelId = params?.modelId as string | undefined;
    if (!apolloClient || !modelId) {
        return null;
    }
    return (
        <ContentModelEditorProvider key={modelId} apolloClient={apolloClient} modelId={modelId}>
            <DndProvider backend={HTML5Backend}>
                <ContentModelEditor />
            </DndProvider>
        </ContentModelEditorProvider>
    );
};
export default ContentModelEditorView;
