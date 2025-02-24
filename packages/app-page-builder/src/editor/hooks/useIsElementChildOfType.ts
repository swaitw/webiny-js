import { PbEditorElement } from "~/types";
import { useElementById } from "~/editor";

export const useIsElementChildOfType = (element: PbEditorElement | null, elementType: string) => {
    const [parent] = useElementById(element?.parent || "n/a");

    if (!parent || !element) {
        return { index: -1, isChildOfType: false };
    }

    if (parent.type === elementType) {
        return { index: parent.elements.findIndex(el => element.id === el), isChildOfType: true };
    }

    return { index: -1, isChildOfType: false };
};
