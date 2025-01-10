import { useCallback } from "react";
import { useEventActionHandler, useGetElementById } from "~/editor";
import { MoveElementActionEvent } from "~/editor/recoil/actions/moveElement";

export const useMoveElement = () => {
    const editorHandler = useEventActionHandler();
    const { getElementById } = useGetElementById();

    const moveElementIndex = async (elementId: string, index: number) => {
        const element = await getElementById(elementId);
        if (!element || !element.parent) {
            return;
        }

        const parent = await getElementById(element.parent);
        if (!parent) {
            return;
        }

        const currentPosition = parent.elements.findIndex(el => el === element.id);
        const newPosition = currentPosition + index;
        if (newPosition < 0 || newPosition > parent.elements.length) {
            return;
        }

        editorHandler.trigger(
            new MoveElementActionEvent({
                source: {
                    id: element.id,
                    type: element.type,
                    position: currentPosition
                },
                target: {
                    id: parent.id,
                    position: newPosition,
                    type: parent.type
                }
            })
        );
    };

    const moveElementUp = useCallback(
        (elementId: string) => {
            moveElementIndex(elementId, -1);
        },
        [getElementById]
    );

    const moveElementDown = useCallback(
        (elementId: string) => {
            moveElementIndex(elementId, 1);
        },
        [getElementById]
    );

    return { moveElementUp, moveElementDown };
};
