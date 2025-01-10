import React from "react";
import { createRenderer } from "~/createRenderer";
import { useRenderer } from "~/hooks/useRenderer";
import { ElementInput } from "~/inputs/ElementInput";

export interface IconElementData {
    icon: {
        markup: string;
        width?: number;
    };
}

const elementInputs = {
    markup: ElementInput.create<string, IconElementData>({
        name: "markup",
        type: "html",
        getDefaultValue: ({ element }) => {
            return element.data.icon?.markup;
        }
    })
};

export const IconRenderer = createRenderer<unknown, typeof elementInputs>(
    () => {
        const { getInputValues } = useRenderer();
        const inputs = getInputValues<typeof elementInputs>();

        return <div dangerouslySetInnerHTML={{ __html: inputs.markup ?? "" }} />;
    },
    { inputs: elementInputs }
);
