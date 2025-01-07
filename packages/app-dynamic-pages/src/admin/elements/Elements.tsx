import React from "react";
import { plugins } from "@webiny/plugins";
import { createRepeaterElement } from "~/admin/elements/repeater";
import { createEntriesListElement } from "~/admin/elements/entriesList";
import { DynamicGrid } from "./renderers/DynamicGrid";
import { createEntriesSearchElement } from "~/admin/elements/entriesSearch";

export const Elements = React.memo(function Elements() {
    plugins.register(
        createRepeaterElement(),
        createEntriesListElement(),
        createEntriesSearchElement()
    );

    return (
        <>
            <DynamicGrid />
        </>
    );
});
