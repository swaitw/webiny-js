import React from "react";
import { ElementDataSettings } from "./ElementDataSettings";
import { EditorConfig } from "@webiny/app-page-builder/editor";

const { Ui } = EditorConfig;

export const SetupElementDataSettings = () => {
    return (
        <>
            <Ui.Sidebar.Group name={"data"} element={<ElementDataSettings />} />
        </>
    );
};
