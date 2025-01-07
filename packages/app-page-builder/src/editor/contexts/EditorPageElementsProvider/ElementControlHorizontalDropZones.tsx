import React from "react";
import { useRenderer } from "@webiny/app-page-builder-elements";
import { DropElementActionEvent } from "~/editor/recoil/actions";
import Droppable, { DragObjectWithTypeWithTarget } from "~/editor/components/Droppable";
import { useEventActionHandler } from "~/editor/hooks/useEventActionHandler";
import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { uiAtom } from "~/editor/recoil/modules";
import { useSnackbar } from "@webiny/app-admin";
import { getElementTitle } from "~/editor/contexts/EditorPageElementsProvider/getElementTitle";

interface WrapperDroppableProps {
    below: boolean;
    zIndex: number;
}

export const WrapperDroppable = styled.div<WrapperDroppableProps>(({ below, zIndex }) => ({
    height: "10px",
    width: "100%",
    position: "absolute",
    [below ? "bottom" : "top"]: 0,
    left: 0,
    zIndex: zIndex
}));

interface InnerDivProps {
    zIndex: number;
    label: string;
}

const InnerDiv = styled.div<InnerDivProps>`
    height: 5px;
    width: 100%;
    z-index: ${props => props.zIndex};
    border-radius: 5px;
    box-sizing: border-box;
    display: none;
    :before {
        content: ${props => `"Drop into ${props.label}"`};
        background-color: var(--mdc-theme-primary);
        color: #fff;
        position: absolute;
        padding: 2px 5px;
        font-size: 10px;
        text-align: center;
        line-height: 14px;
        left: 50%;
        transform: translateX(-50%);
        top: -7px;
    }
`;

interface OuterDivProps {
    isOver: boolean;
    below: boolean;
    zIndex: number;
    children: React.ReactNode;
}

const OuterDiv = React.memo<OuterDivProps>(
    styled.div(
        ({ zIndex }) => ({
            margin: 0,
            padding: 0,
            width: "100%",
            zIndex,
            backgroundColor: "transparent",
            position: "absolute",
            display: "flex",
            justifyContent: "center"
        }),
        (props: OuterDivProps) => ({
            [props.below ? "bottom" : "top"]: 0,
            [InnerDiv as unknown as string]: {
                backgroundColor: props.isOver
                    ? "var(--mdc-theme-primary)"
                    : "var(--mdc-theme-secondary)",
                display: props.isOver ? "block" : "none"
            }
        })
    )
);

export const ElementControlHorizontalDropZones = () => {
    const { getElement, meta } = useRenderer();
    const { isDragging } = useRecoilValue(uiAtom);
    const element = getElement();
    const handler = useEventActionHandler();
    const { showSnackbar } = useSnackbar();
    const parentType = meta.parentElement.type;

    const { type } = element;

    const canDrop = (item: DragObjectWithTypeWithTarget) => {
        if (!item) {
            return false;
        }

        const { target } = item;
        // If the `target` property of the dragged element's plugin is an array, we want to
        // check if the dragged element can be dropped into the target element (the element
        // for which this drop zone is rendered).
        if (Array.isArray(target) && target.length > 0) {
            if (!target.includes(parentType)) {
                return false;
            }
        }

        return true;
    };

    const dropElementAction = (source: DragObjectWithTypeWithTarget, position: number) => {
        if (!canDrop(source)) {
            const sourceTitle = getElementTitle(source.type);
            const targetTitle = getElementTitle(parentType);
            showSnackbar(`${sourceTitle} cannot be dropped into ${targetTitle}.`);
            return;
        }

        handler.trigger(
            new DropElementActionEvent({
                source,
                target: {
                    id: meta.parentElement.id,
                    type: parentType,
                    position
                }
            })
        );
    };

    if (!isDragging) {
        return null;
    }

    // Z-index of element controls overlay depends on the depth of the page element.
    // The deeper the page element is in the content hierarchy, the greater the index.
    const zIndex = meta.depth * 10 * 2;

    return (
        <>
            <Droppable
                isVisible={({ item }) => canDrop(item)}
                onDrop={source => dropElementAction(source, meta.elementIndex)}
                type={type}
            >
                {({ drop, isOver }) => (
                    <WrapperDroppable ref={drop} below={false} zIndex={zIndex}>
                        <OuterDiv isOver={isOver} below={false} zIndex={zIndex}>
                            <InnerDiv zIndex={zIndex} label={parentType} />
                        </OuterDiv>
                    </WrapperDroppable>
                )}
            </Droppable>
            {meta.isLastElement && (
                <Droppable
                    isVisible={({ item }) => canDrop(item)}
                    onDrop={source => dropElementAction(source, meta.elementIndex + 1)}
                    type={type}
                >
                    {({ drop, isOver }) => (
                        <WrapperDroppable ref={drop} below zIndex={zIndex}>
                            <OuterDiv isOver={isOver} below zIndex={zIndex}>
                                <InnerDiv zIndex={zIndex} label={parentType} />
                            </OuterDiv>
                        </WrapperDroppable>
                    )}
                </Droppable>
            )}
        </>
    );
};
