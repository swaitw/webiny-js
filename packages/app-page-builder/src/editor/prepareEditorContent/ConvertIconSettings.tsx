import React from "react";
import { PrepareEditorContent } from "../PrepareEditorContent";
import { convertIconSettings } from "~/backwardsCompatibility/convertIconSettings";

/**
 * This component ensures that all elements using an `icon` have the new icon settings structure.
 */
export const ConvertIconSettings = () => {
    return <PrepareEditorContent elementVisitor={element => convertIconSettings(element)} />;
};
