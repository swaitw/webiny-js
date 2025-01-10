import React from "react";
import { ReactComponent as RepeatIcon } from "@material-design-icons/svg/round/repeat.svg";
import { PbEditorPageElementPlugin, PbElement } from "@webiny/app-page-builder/types";
import { AdminRepeaterRenderer } from "./renderers/Repeater";

export const createRepeaterElement = (): PbEditorPageElementPlugin => {
    return {
        name: `pb-editor-page-element-repeater`,
        type: "pb-editor-page-element",
        elementType: "repeater",
        canReceiveChildren: true,
        toolbar: {
            title: "Repeater Element",
            group: "pb-editor-element-group-basic",
            preview() {
                return <RepeatIcon />;
            }
        },
        settings: [
            "pb-editor-page-element-settings-clone",
            "pb-editor-page-element-settings-delete"
        ],
        target: ["cell", "block"],
        create() {
            return {
                type: this.elementType,
                elements: [],
                data: {}
            };
        },

        render(props) {
            return <AdminRepeaterRenderer {...props} element={props.element as PbElement} />;
        }
    };
};
