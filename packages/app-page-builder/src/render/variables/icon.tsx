import React from "react";
import { IconRenderer } from "@webiny/app-page-builder-elements/renderers/icon";
import { useElementVariables } from "~/hooks/useElementVariables";
import { PbBlockVariable } from "~/types";

const getVariableValues = (variables: PbBlockVariable<{ markup: string }>[]) => {
    const value = variables[0].value;
    if ("svg" in value) {
        // This is a legacy variable value.
        return {
            markup: value.svg as string
        };
    }

    return value;
};

export const IconRendererWithVariables = IconRenderer.createDecorator(Original => {
    return function ButtonRenderer(props) {
        const variables = useElementVariables(props.element);

        if (!variables.length) {
            return <Original {...props} />;
        }

        const variableValues = getVariableValues(variables);

        return (
            <Original
                {...props}
                inputs={{
                    markup: props.inputs?.markup ?? variableValues.markup
                }}
            />
        );
    };
});
