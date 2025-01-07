import get from "lodash/get";
import type { ElementInputs } from "@webiny/app-page-builder-elements";
import type { GenericRecord } from "@webiny/app/types";
import type { PbEditorElement } from "~/types";
import { isValidLexicalData } from "@webiny/lexical-editor";
import {
    ElementInputBinding,
    useBindingContext,
    useDataSourceData,
    useDynamicDocument
} from "~/dataInjection";

const BIND_ALL = "*";

export const useBindElementInputs = (
    element: PbEditorElement,
    inputs: ElementInputs | undefined,
    values: GenericRecord
) => {
    const { dataBindings } = useDynamicDocument();
    const { data } = useDataSourceData();
    const { getRelativePath } = useBindingContext();

    const elementInputBindings = dataBindings.filter(binding =>
        binding.bindTo.startsWith(`element:${element.id}.`)
    );

    const elementInputs = elementInputBindings.reduce((acc, binding) => {
        const relativePath = getRelativePath(binding.bindFrom);
        let inputValue = binding.bindFrom === BIND_ALL ? data : get(data, relativePath);

        if (inputValue) {
            const inputBinding = ElementInputBinding.create(binding);
            const inputName = inputBinding.getInputName();
            const input = inputs ? inputs[inputName] : undefined;

            if (!input) {
                return { ...acc, [inputName]: inputValue };
            }

            // Experiment! If you want to target a specific location for value injection, you could use
            // a special placeholder. This would also help with application of styles in Lexical.
            const baseValue: any = values[inputName];

            if (String(baseValue).includes("{=value}")) {
                inputValue = baseValue.replace("{=value}", inputValue);
            }

            if (input.getType() === "lexical") {
                inputValue = injectTextIntoLexicalState(values[inputName], inputValue);
            }

            return { ...acc, [inputName]: inputValue };
        }
        return acc;
    }, values);

    return { elementInputs };
};

function injectTextIntoLexicalState(lexicalState: string, text: GenericRecord | string) {
    if (typeof text !== "string") {
        return JSON.stringify(text);
    }

    if (isValidLexicalData(text)) {
        return text;
    }

    const value = JSON.parse(lexicalState);
    value["root"].children[0].children[0].text = text;
    return JSON.stringify(value);
}
