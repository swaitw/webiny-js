import React from "react";
import { Element as ElementType } from "~/types";
import { Element } from "./Element";
import { useRenderer } from "~/hooks/useRenderer";

// All elements have a unique ID. The only exception are the elements
// nested in a pre-made block (a block created via the Blocks module).
// In that case, for every nested element, we make the key by joining:
// 1. the pre-made block's ID
// 2. an index of the nested element
const getElementKey = (
    elementKeyPrefix: string | undefined,
    element: ElementType,
    elementIndex: number,
    parentBlockElement?: ElementType
) => {
    let parts = [elementKeyPrefix, element.id, elementIndex.toString()];

    if (parentBlockElement) {
        parts = [parentBlockElement.id, elementIndex.toString()];
    }
    // Add element type for easier debugging and more clarity in the profiler.
    parts.push(element.type);

    return parts.filter(Boolean).join("-");
};

interface ElementWrapper {
    (element: JSX.Element, index: number): JSX.Element;
}

const passthroughWrapper: ElementWrapper = element => element;

export interface ElementsProps {
    element: ElementType;
    wrapper?: ElementWrapper;
    elementKeyPrefix?: string;
}

export const Elements = (props: ElementsProps) => {
    // `Elements` component is used within a renderer, meaning
    // we can always be sure `useRenderer` hook is available.
    const { meta: currentRendererMeta } = useRenderer();
    const wrapper = props.wrapper || passthroughWrapper;

    const elements = props.element.elements;

    let parentBlockElement: ElementType;
    if (props.element.data.blockId) {
        parentBlockElement = props.element;
    } else {
        parentBlockElement = currentRendererMeta.parentBlockElement;
    }

    let parentTemplateBlockElement: ElementType;
    if (props.element.data.templateBlockId) {
        parentTemplateBlockElement = props.element;
    } else {
        parentTemplateBlockElement = currentRendererMeta.parentTemplateBlockElement;
    }

    let parentDocumentElement: ElementType;
    if (props.element.type === "document") {
        parentDocumentElement = props.element;
    } else {
        parentDocumentElement = currentRendererMeta.parentDocumentElement;
    }

    return (
        <>
            {elements.map((element, index) => {
                const key = getElementKey(
                    props.elementKeyPrefix,
                    element,
                    index,
                    parentBlockElement
                );

                return React.cloneElement(
                    wrapper(
                        <Element
                            element={element}
                            meta={{
                                depth: (currentRendererMeta.depth || 0) + 1,
                                parentElement: props.element,
                                parentBlockElement,
                                parentTemplateBlockElement,
                                parentDocumentElement,
                                isFirstElement: index === 0,
                                isLastElement: index === elements.length - 1,
                                elementIndex: index
                            }}
                        />,
                        index
                    ),
                    { key }
                );
            })}
        </>
    );
};
