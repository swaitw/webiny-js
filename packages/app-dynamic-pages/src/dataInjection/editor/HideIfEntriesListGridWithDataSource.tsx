import React from "react";
import { useActiveElement, useIsElementChildOfType } from "@webiny/app-page-builder/editor";
import { useElementBindings } from "@webiny/app-page-builder/dataInjection";

interface HideIfEntriesListGridWithDataSourceProps {
    children: React.ReactNode;
}

export const HideIfEntriesListGridWithDataSource = ({
    children
}: HideIfEntriesListGridWithDataSourceProps) => {
    const [element] = useActiveElement();
    const { bindings } = useElementBindings(element!.id);
    const { isChildOfType } = useIsElementChildOfType(element, "entries-list");

    if (!element) {
        return null;
    }

    const hasDataSourceBinding = bindings.some(binding => binding.bindFrom === "*");
    const shouldHide = isChildOfType && element.type === "grid" && hasDataSourceBinding;

    return shouldHide ? null : <>{children}</>;
};
