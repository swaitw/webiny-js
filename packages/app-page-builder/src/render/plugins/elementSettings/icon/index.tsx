import React from "react";
import { Element } from "@webiny/app-page-builder-elements";
import { convertIconSettings } from "~/backwardsCompatibility/convertIconSettings";

export const ConvertIconSettings = Element.createDecorator(Original => {
    const elementsWithIcons = ["button", "icon"];

    return function Element(props) {
        if (!props.element) {
            return <Original {...props} />;
        }

        if (elementsWithIcons.includes(props.element.type)) {
            const newElement = convertIconSettings(props.element);
            return <Original {...props} element={newElement} />;
        }
        return <Original {...props} />;
    };
});
