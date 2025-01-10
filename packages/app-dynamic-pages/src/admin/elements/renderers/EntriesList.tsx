import React from "react";
import { PbElement } from "@webiny/app-page-builder/types";
import { EmptyCell } from "@webiny/app-page-builder/editor/plugins/elements/cell/EmptyCell";
import { useElementWithChildren } from "@webiny/app-page-builder/editor";
import { EntriesListRenderer } from "~/dataInjection/renderers/EntriesList";

interface AdminEntriesListRendererProps {
    element: PbElement;
}

export const AdminEntriesListRenderer = ({ element, ...rest }: AdminEntriesListRendererProps) => {
    const elementWithChildren = useElementWithChildren(element.id);

    if (!elementWithChildren) {
        return null;
    }

    return (
        <EntriesListRenderer
            {...rest}
            element={elementWithChildren}
            ifEmpty={<EmptyCell element={elementWithChildren} />}
        />
    );
};

AdminEntriesListRenderer.displayName = "AdminEntriesListRenderer";
