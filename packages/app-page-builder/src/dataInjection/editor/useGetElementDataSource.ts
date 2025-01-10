import { useCallback } from "react";
import type { PbEditorElement, PbDataBinding, PbDataSource } from "~/types";
import { useGetElement } from "~/editor";

export function useGetElementDataSource() {
    const getElementById = useGetElement();

    const getElementDataSource = useCallback(
        async (
            dataSources: PbDataSource[],
            bindings: PbDataBinding[],
            element: PbEditorElement
        ): Promise<PbDataSource | undefined> => {
            const elementBinding = bindings.find(binding =>
                binding.bindTo.startsWith(`element:${element.id}.`)
            );

            if (elementBinding) {
                const dataSource = dataSources.find(
                    source => source.name === elementBinding.dataSource
                );

                if (!dataSource) {
                    return undefined;
                }
            }

            if (element.parent) {
                const parentElement = await getElementById(element.parent);
                if (parentElement) {
                    return getElementDataSource(dataSources, bindings, parentElement);
                }
            }

            return undefined;
        },
        []
    );

    return { getElementDataSource };
}
