import React from "react";
import { BlockRenderer } from "@webiny/app-page-builder-elements/renderers/block";
import { EmptyCell } from "~/editor/plugins/elements/cell/EmptyCell";
import { PbEditorElement } from "~/types";
import { useElementWithChildren } from "~/editor";

type Props = Omit<React.ComponentProps<typeof BlockRenderer>, "element"> & {
    element: PbEditorElement;
};

export const Block = (props: Props) => {
    const { element } = props;

    const elementWithChildren = useElementWithChildren(element.id);
    if (!elementWithChildren) {
        return null;
    }

    return (
        <BlockRenderer
            {...props}
            element={elementWithChildren}
            ifEmpty={<EmptyCell element={element} depth={props.meta?.depth} />}
        />
    );
};
