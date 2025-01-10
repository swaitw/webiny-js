import React from "react";
import { PbRenderElementPlugin } from "@webiny/app-page-builder";
import { RepeaterRenderer } from "~/dataInjection/renderers/Repeater";
import { EntriesListRenderer } from "~/dataInjection/renderers/EntriesList";
import { EntriesSearchRenderer } from "~/dataInjection/renderers/EntriesSearch";
import { DynamicGrid } from "~/dataInjection/renderers/DynamicGrid";

export const DynamicElementRenderers = () => {
    return (
        <>
            <PbRenderElementPlugin elementType={"repeater"} renderer={RepeaterRenderer} />
            <PbRenderElementPlugin elementType={"entries-list"} renderer={EntriesListRenderer} />
            <PbRenderElementPlugin
                elementType={"entries-search"}
                renderer={EntriesSearchRenderer}
            />
            <DynamicGrid />
        </>
    );
};
