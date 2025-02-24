import React from "react";
import { ElementRendererInputs } from "@webiny/app-page-builder-elements";
import { useBindElementInputs } from "./useBindElementInputs";

export const InjectDynamicValues = ElementRendererInputs.createDecorator(Original => {
    return function ElementRendererInputs(props) {
        const { element, inputs, values } = props;
        const { elementInputs } = useBindElementInputs(element, inputs, values);

        return <Original {...props} values={elementInputs} />;
    };
});
