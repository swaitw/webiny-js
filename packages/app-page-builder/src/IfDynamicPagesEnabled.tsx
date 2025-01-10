import React from "react";
import { featureFlags } from "@webiny/feature-flags";

export const IfDynamicPagesEnabled = ({ children }: { children: React.ReactNode }) => {
    if (featureFlags.experimentalDynamicPages === true) {
        return <>{children}</>;
    }

    return null;
};
