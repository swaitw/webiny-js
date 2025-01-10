import React, { useMemo } from "react";
import type { Element } from "@webiny/app-page-builder-elements/types";
import { Editor, EditorProps } from "~/admin/components/Editor";
import { PbEditorElementTree } from "~/types";

export type ElementVisitor = (element: Element) => Element;

const traverseContent = (
    element: PbEditorElementTree,
    visitor: (element: Element) => Element
): Element => {
    const newElement = visitor(element as Element) ?? element;

    return {
        ...newElement,
        elements: newElement.elements.map(element => {
            return traverseContent(element, visitor);
        })
    };
};

const prepareEditorContent = (
    stateInitializerFactory: EditorProps["stateInitializerFactory"],
    elementVisitor: ElementVisitor
): EditorProps["stateInitializerFactory"] => {
    return () => {
        const state = stateInitializerFactory();
        const newContent = traverseContent(state.content, elementVisitor);
        return { ...state, content: newContent };
    };
};

interface PrepareEditorContentProps {
    elementVisitor: ElementVisitor;
}

export const PrepareEditorContent = ({ elementVisitor }: PrepareEditorContentProps) => {
    const Decorator = useMemo(
        () =>
            Editor.createDecorator(Original => {
                return function Editor(props) {
                    return (
                        <Original
                            {...props}
                            stateInitializerFactory={prepareEditorContent(
                                props.stateInitializerFactory,
                                elementVisitor
                            )}
                        />
                    );
                };
            }),
        []
    );

    return <Decorator />;
};
