import { useCallback } from "react";
import { plugins } from "@webiny/plugins";
import { useEventActionHandler, useFindElementBlock, useUpdateElement } from "~/editor";
import { DeleteElementActionEvent } from "~/editor/recoil/actions";
import type { PbBlockVariable, PbEditorElement, PbEditorPageElementPlugin } from "~/types";

const removeVariableFromBlock = (block: PbEditorElement, variableId: string) => {
    const variables = block.data.variables ?? [];

    const updatedVariables = variables.filter(
        (variable: PbBlockVariable) => variable.id.split(".")[0] !== variableId
    );

    return {
        ...block,
        data: {
            ...block.data,
            variables: updatedVariables
        }
    };
};

export const useDeleteElement = () => {
    const eventActionHandler = useEventActionHandler();
    const updateElement = useUpdateElement();
    const { findElementBlock } = useFindElementBlock();

    const canDeleteElement = useCallback((element: PbEditorElement) => {
        const plugin = plugins
            .byType<PbEditorPageElementPlugin>("pb-editor-page-element")
            .find(pl => pl.elementType === element.type);

        if (!plugin) {
            return false;
        }

        if (typeof plugin.canDelete === "function") {
            if (!plugin.canDelete({ element })) {
                return false;
            }
        }

        return true;
    }, []);

    const deleteElement = useCallback(async (element: PbEditorElement): Promise<void> => {
        const block = await findElementBlock(element.id);

        // We need to remove element variable from block if it exists
        if (element.data?.variableId && block) {
            const updatedBlock = removeVariableFromBlock(block, element.data.variableId);

            updateElement(updatedBlock);
        }

        eventActionHandler.trigger(
            new DeleteElementActionEvent({
                element
            })
        );
    }, []);

    return { canDeleteElement, deleteElement };
};
