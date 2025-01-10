import React from "react";
import { IfDynamicPagesEnabled } from "@webiny/app-page-builder/IfDynamicPagesEnabled";

const SetupDynamicPages = React.lazy(() => {
    return import(/* webpackChunkName: "experimentalDynamicPages" */ "./SetupDynamicPages").then(
        m => ({ default: m.SetupDynamicPages })
    );
});

export const Extensions = () => {
    return (
        <IfDynamicPagesEnabled>
            <React.Suspense fallback={null}>
                <SetupDynamicPages />
            </React.Suspense>
        </IfDynamicPagesEnabled>
    );
};
