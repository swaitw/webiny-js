import React from "react";
import {
    useActiveElement,
    useIsElementChildOfType,
    EditorConfig
} from "@webiny/app-page-builder/editor";

const { Ui } = EditorConfig;

export const ElementDataSettings = () => {
    const [element] = useActiveElement();
    const { isChildOfType } = useIsElementChildOfType(element, "entries-list");
    const isDisabled = !element || (isChildOfType && element?.type === "grid");

    return (
        <Ui.Sidebar.Group.Tab
            label={"Data"}
            element={
                <Ui.Sidebar.ScrollableContainer>
                    <Ui.Sidebar.Elements group={"dataSettings"} />
                </Ui.Sidebar.ScrollableContainer>
            }
            disabled={isDisabled}
        />
    );
};
