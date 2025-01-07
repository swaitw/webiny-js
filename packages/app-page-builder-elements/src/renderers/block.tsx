import React from "react";
import { Elements } from "~/components/Elements";
import { createRenderer } from "~/createRenderer";
import { useRenderer } from "~/hooks/useRenderer";
import { BlockProvider } from "./block/BlockProvider";
export * from "./block/BlockProvider";

interface BlockRendererProps {
    ifEmpty?: JSX.Element;
}

export const BlockRenderer = createRenderer<BlockRendererProps>(
    ({ ifEmpty = null }) => {
        const { getElement } = useRenderer();

        const element = getElement();

        if (element.elements.length === 0) {
            return ifEmpty;
        }

        return (
            <BlockProvider block={element}>
                <Elements element={element} />
                {element.data.blockId && (
                    <ps-tag data-key={"pb-page-block"} data-value={element.data.blockId} />
                )}
            </BlockProvider>
        );
    },
    {
        baseStyles: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            boxSizing: "border-box"
        }
    }
);
