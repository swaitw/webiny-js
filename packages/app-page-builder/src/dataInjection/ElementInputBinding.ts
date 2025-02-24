import { PbDataBinding } from "~/types";

export class ElementInputBinding {
    private binding: PbDataBinding;
    private readonly elementId: string;
    private readonly inputName: string;

    private constructor(binding: PbDataBinding) {
        this.binding = binding;
        const [elementId, inputName] = binding.bindTo.replace("element:", "").split(".");
        this.elementId = elementId;
        this.inputName = inputName;
    }

    static create(binding: PbDataBinding) {
        return new ElementInputBinding(binding);
    }

    getDataSource() {
        return this.binding.dataSource;
    }

    getElementId() {
        return this.elementId;
    }

    getInputName() {
        return this.inputName;
    }

    getSource() {
        return this.binding.bindFrom;
    }
}
