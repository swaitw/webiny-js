import { PbEditorElementTree } from "~/types";
import { InjectVariableValuesIntoElement } from "~/pageEditor/config/Toolbar/InjectVariableValuesIntoElement";

export class UnlinkPageFromTemplate {
    execute(content: PbEditorElementTree) {
        const newContent = structuredClone(content);
        const injectVariableValues = new InjectVariableValuesIntoElement();

        const unlinkedBlocks = newContent.elements.map(block => {
            delete block.data["templateBlockId"];

            if (block.data.blockId) {
                return block;
            }

            const blockVariables = block.data.variables || [];

            const blockWithValues = injectVariableValues.execute(block, blockVariables);

            delete blockWithValues.data["variables"];

            return blockWithValues;
        });

        delete newContent.data["template"];

        return { ...newContent, elements: unlinkedBlocks };
    }
}
