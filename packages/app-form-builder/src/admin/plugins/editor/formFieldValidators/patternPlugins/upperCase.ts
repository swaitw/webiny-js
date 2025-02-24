import { FbBuilderFormFieldPatternValidatorPlugin } from "~/types";

const plugin: FbBuilderFormFieldPatternValidatorPlugin = {
    type: "form-editor-field-validator-pattern",
    name: "form-editor-field-validator-pattern-upper-case",
    pattern: {
        message: "Only upper case characters are allowed.",
        name: "upperCase",
        label: "Upper case"
    }
};
export default plugin;
