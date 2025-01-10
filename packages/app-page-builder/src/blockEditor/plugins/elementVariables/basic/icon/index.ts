import { PbBlockEditorCreateVariablePlugin } from "~/types";

export default {
    name: "pb-block-editor-create-variable-icon",
    type: "pb-block-editor-create-variable",
    elementType: "icon",
    createVariables({ element }) {
        return [
            {
                id: element.id,
                type: "icon",
                label: "Icon",
                value: {
                    icon: element?.data.icon?.icon,
                    markup: element?.data.icon?.markup,
                    width: element?.data.icon?.width
                }
            }
        ];
    },
    getVariableValue({ element }) {
        return {
            icon: element?.data.icon?.icon,
            markup: element?.data.icon?.markup,
            width: element?.data.icon?.width
        };
    }
} as PbBlockEditorCreateVariablePlugin;
