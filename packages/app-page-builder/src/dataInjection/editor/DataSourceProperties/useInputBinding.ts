import { useCallback } from "react";
import type { PbEditorElement, PbDataBinding } from "~/types";
import { ElementInputBinding, useDynamicDocument } from "~/dataInjection";
import { useGetElementDataSource } from "./useGetElementDataSource";

const byElementIdAndName = (id: string, inputName: string) => {
    return (binding: ElementInputBinding) => {
        return binding.getInputName() === inputName && binding.getElementId() === id;
    };
};

export const useInputBinding = (element: PbEditorElement, inputName: string) => {
    const { dataBindings, updateDataBindings } = useDynamicDocument();
    const { getElementDataSource } = useGetElementDataSource();

    // TODO: ideally, we want this mapping to happen in the dynamic document provider.
    const bindings = dataBindings.map(binding => ElementInputBinding.create(binding));

    const binding = bindings.find(byElementIdAndName(element.id, inputName));

    const onChange = useCallback(
        async (value: unknown) => {
            const bindingIndex = bindings.findIndex(byElementIdAndName(element.id, inputName));

            if (value === "") {
                // Remove binding.
                return updateDataBindings(bindings => {
                    return [
                        ...bindings.slice(0, bindingIndex),
                        ...bindings.slice(bindingIndex + 1)
                    ];
                });
            }

            const elementDataSource = await getElementDataSource(element);

            if (!elementDataSource) {
                console.warn(`DataSource not found for element`, element);
                return;
            }

            const binding: PbDataBinding = {
                dataSource: elementDataSource.name,
                bindFrom: String(value),
                bindTo: `element:${element.id}.${inputName}`
            };

            updateDataBindings(bindings => {
                if (bindingIndex > -1) {
                    // Update binding.
                    return [
                        ...bindings.slice(0, bindingIndex),
                        binding,
                        ...bindings.slice(bindingIndex + 1)
                    ];
                }

                // Add binding.
                return [...bindings, binding];
            });
        },
        [bindings]
    );

    return { binding, onChange };
};
