import React from "react";
import {
    createRenderer,
    ElementInput,
    Elements,
    useRenderer
} from "@webiny/app-page-builder-elements";
import { GenericRecord } from "@webiny/app/types";
import { DataSourceDataProvider } from "@webiny/app-page-builder/dataInjection";

export const elementInputs = {
    dataSource: ElementInput.create<GenericRecord[]>({
        name: "dataSource",
        type: "array",
        translatable: false,
        getDefaultValue() {
            return [];
        }
    })
};

interface EntriesListRendererProps {
    ifEmpty?: JSX.Element;
}

export const EntriesListRenderer = createRenderer<EntriesListRendererProps, typeof elementInputs>(
    ({ ifEmpty = null }) => {
        const { getElement, getInputValues } = useRenderer();

        const element = getElement();
        const inputs = getInputValues<typeof elementInputs>();
        const dataSources = inputs.dataSource || [];

        if (element.elements.length === 0) {
            return ifEmpty;
        }

        if (!dataSources.length) {
            return <Elements element={element} />;
        }

        return (
            <>
                {dataSources.map((dataSource, index) => {
                    return (
                        <DataSourceDataProvider dataSource={dataSource} key={index}>
                            <Elements element={element} elementKeyPrefix={index.toString()} />
                        </DataSourceDataProvider>
                    );
                })}
            </>
        );
    },
    {
        inputs: elementInputs
    }
);
