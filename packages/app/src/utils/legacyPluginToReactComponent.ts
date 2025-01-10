import React from "react";
import { useRegisterLegacyPlugin } from "~/hooks/useRegisterLegacyPlugin";

export interface LegacyPluginToReactComponentParams<TProps extends Record<string, any>> {
    pluginType: string;
    componentDisplayName: string;
    mapProps?: (props: TProps) => TProps;
}

export const legacyPluginToReactComponent = function <TProps extends Record<string, any>>(
    params: LegacyPluginToReactComponentParams<TProps>
) {
    const Component: React.ComponentType<TProps> = props => {
        const plugin = Object.assign(
            { type: params.pluginType },
            params.mapProps ? params.mapProps(props) : props
        );
        useRegisterLegacyPlugin(plugin);
        return null;
    };

    Component.displayName = params.componentDisplayName;

    return Component;
};
