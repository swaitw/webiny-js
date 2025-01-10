import type { PbEditorPageElementPlugin as BasePbEditorPageElementPlugin } from "~/types";
import type { Renderer } from "@webiny/app-page-builder-elements/types";

import { legacyPluginToReactComponent } from "@webiny/app/utils";

export interface PbEditorPageElementPluginProps
    extends Pick<
        BasePbEditorPageElementPlugin,
        | "elementType"
        | "toolbar"
        | "help"
        | "target"
        | "settings"
        | "create"
        | "canDelete"
        | "canReceiveChildren"
        | "onReceived"
        | "onChildDeleted"
        | "onCreate"
        | "renderElementPreview"
    > {
    renderer: Renderer;
}

export const PbEditorPageElementPlugin =
    legacyPluginToReactComponent<PbEditorPageElementPluginProps>({
        pluginType: "pb-editor-page-element",
        componentDisplayName: "PbEditorPageElementPlugin",
        mapProps: props => {
            return {
                ...props,
                render: props.renderer
            };
        }
    });
