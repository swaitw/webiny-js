import React from "react";
import { ReactComponent as RepeatIcon } from "@material-design-icons/svg/round/repeat.svg";
import { PbEditorPageElementPlugin, PbElement } from "@webiny/app-page-builder/types";
import { EntriesSearchRenderer } from "~/dataInjection/renderers/EntriesSearch";

export const createEntriesSearchElement = (): PbEditorPageElementPlugin => {
    return {
        name: `pb-editor-page-element-entries-search`,
        type: "pb-editor-page-element",
        elementType: "entries-search",
        canReceiveChildren: false,
        toolbar: {
            title: "Entries Search",
            group: "pb-editor-element-group-basic",
            preview() {
                return <RepeatIcon />;
            }
        },
        settings: ["pb-editor-page-element-settings-delete"],
        target: ["cell"],
        create() {
            return {
                type: this.elementType,
                elements: [],
                data: {}
            };
        },

        render(props) {
            return <EntriesSearchRenderer {...props} element={props.element as PbElement} />;
        }
    };
};
