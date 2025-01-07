import React from "react";
import { ReactComponent as RepeatIcon } from "@material-design-icons/svg/round/repeat.svg";
import { PbEditorPageElementPlugin, PbElement } from "@webiny/app-page-builder/types";
import { AdminEntriesListRenderer } from "./renderers/EntriesList";
import { createElement } from "@webiny/app-page-builder/editor/helpers";

export const createEntriesListElement = (): PbEditorPageElementPlugin => {
    return {
        name: `pb-editor-page-element-entries-list`,
        type: "pb-editor-page-element",
        elementType: "entries-list",
        canReceiveChildren: true,
        toolbar: {
            title: "Entries List",
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
                elements: [createElement("grid")],
                data: {}
            };
        },

        render(props) {
            return <AdminEntriesListRenderer {...props} element={props.element as PbElement} />;
        }
    };
};
