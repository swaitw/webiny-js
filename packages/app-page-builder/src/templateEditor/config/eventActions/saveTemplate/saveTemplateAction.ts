import lodashDebounce from "lodash/debounce";
import { plugins } from "@webiny/plugins";
import { SaveTemplateActionArgsType } from "./types";
import { TemplateEventActionCallable } from "~/templateEditor/types";
import { PbElement, PbBlockVariable, PbBlockEditorCreateVariablePlugin } from "~/types";
import { useUpdatePageTemplate } from "~/features";

export const findElementByVariableId = (elements: PbElement[], variableId: string): any => {
    for (const element of elements) {
        if (element.data?.variableId === variableId) {
            return element;
        }
        if (element.elements?.length > 0) {
            const found = findElementByVariableId(element.elements, variableId);
            if (found) {
                return found;
            }
        }
    }
};

const syncTemplateBlockVariables = (block: PbElement) => {
    const createVariablePlugins = plugins.byType<PbBlockEditorCreateVariablePlugin>(
        "pb-block-editor-create-variable"
    );

    const syncedVariables = block.data?.variables?.reduce(function (
        result: Array<PbBlockVariable>,
        variable: PbBlockVariable
    ) {
        const element = findElementByVariableId(block.elements, variable.id.split(".")[0]);
        const createVariablePlugin = createVariablePlugins.find(
            plugin => plugin.elementType === element?.type
        );

        if (createVariablePlugin) {
            result.push({
                ...variable,
                value: createVariablePlugin.getVariableValue({ element, variableId: variable.id })
            });
        }

        return result;
    },
    []);

    return {
        ...block,
        data: { templateBlockId: block.id, ...block.data, variables: syncedVariables }
    };
};

const syncTemplateVariables = (content: PbElement) => {
    const variables = [];

    for (const block of content.elements) {
        variables.push({
            blockId: block.data.templateBlockId,
            variables: block.data.variables
        });
    }

    return { ...content, data: { ...content.data, template: { variables } } };
};

const triggerOnFinish = (args?: SaveTemplateActionArgsType): void => {
    if (!args || !args.onFinish || typeof args.onFinish !== "function") {
        return;
    }
    args.onFinish();
};
// Setting to `any` as this is not at all important.
let debouncedSave: any = null;

type UpdatePageTemplate = ReturnType<typeof useUpdatePageTemplate>["updatePageTemplate"];

export const createSaveAction = (
    updatePageTemplate: UpdatePageTemplate
): TemplateEventActionCallable<SaveTemplateActionArgsType> => {
    return async (state, meta, args = {}) => {
        const content = (await state.getElementTree()) as PbElement;

        const elements = content.elements.map((element: PbElement) => {
            if (element.type === "block") {
                return syncTemplateBlockVariables(element);
            }
            return element;
        });

        if (debouncedSave) {
            debouncedSave.cancel();
        }

        const runSave = async () => {
            await updatePageTemplate({
                id: state.template.id,
                title: state.template.title || "",
                slug: state.template.slug || "",
                tags: state.template.tags || [],
                description: state.template?.description || "",
                layout: state.template?.layout || "",
                content: syncTemplateVariables({ ...content, elements }),
                dataSources: state.template.dataSources || [],
                dataBindings: state.template.dataBindings || []
            });

            await new Promise(resolve => {
                setTimeout(resolve, 500);
            });

            triggerOnFinish(args);
        };

        if (args && args.debounce === false) {
            runSave();
            return {
                actions: []
            };
        }

        debouncedSave = lodashDebounce(runSave, 2000);
        debouncedSave();

        return {
            actions: []
        };
    };
};
