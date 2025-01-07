import React from "react";
import { PbElement } from "@webiny/app-page-builder/types";
import { EmptyCell } from "@webiny/app-page-builder/editor/plugins/elements/cell/EmptyCell";
import { useElementWithChildren } from "@webiny/app-page-builder/editor";
import { RepeaterRenderer } from "~/dataInjection/renderers/Repeater";

interface AdminRepeaterRendererProps {
    element: PbElement;
}

export const AdminRepeaterRenderer = ({ element, ...rest }: AdminRepeaterRendererProps) => {
    const elementWithChildren = useElementWithChildren(element.id);

    if (!elementWithChildren) {
        return null;
    }

    return (
        <RepeaterRenderer
            {...rest}
            element={elementWithChildren}
            ifEmpty={<EmptyCell element={elementWithChildren} />}
        />
    );
};
