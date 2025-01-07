import React from "react";
import { SetterOrUpdater } from "recoil";
import styled from "@emotion/styled";
import { useActiveElementId } from "~/editor/hooks/useActiveElementId";
import { useElementById } from "~/editor/hooks/useElementById";
import { PbEditorElement } from "~/types";
import { AddElementButton } from "~/editor/plugins/elements/cell/AddElementButton";

const EmptyCellStyled = styled.div<{ isActive: boolean; zIndex: number }>`
    z-index: ${props => props.zIndex};
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    width: 100%;
    border: ${props =>
        props.isActive
            ? "1px dashed var(--mdc-theme-primary)"
            : "1px dashed var(--mdc-theme-secondary)"};
    align-items: center;

    button {
        color: ${props =>
            props.isActive ? "var(--mdc-theme-primary)" : "var(--mdc-theme-secondary)"};
        transition: transform 0.2s;

        &:hover {
            transform: scale(1.3);
        }
    }
`;

interface EmptyCellProps {
    element: PbEditorElement;
    depth?: number;
}

export const EmptyCell = ({ element, depth = 1 }: EmptyCellProps) => {
    const [activeElementId] = useActiveElementId();
    const isActive = activeElementId === element.id;

    const [editorElement] = useElementById(element.id) as [
        PbEditorElement,
        SetterOrUpdater<PbEditorElement>
    ];

    const dragEntered = editorElement.dragEntered;
    const zIndex = 10 + depth + 1;

    return (
        <EmptyCellStyled isActive={isActive || dragEntered} zIndex={isActive ? zIndex : 0}>
            <AddElementButton element={element} />
        </EmptyCellStyled>
    );
};

/**
 * @deprecated Use the named `EmptyCell` export instead.
 */
export default EmptyCell;
