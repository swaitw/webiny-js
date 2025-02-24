import type { CmsContentFormRendererPlugin as BaseCmsContentFormRendererPlugin } from "~/types";
import { legacyPluginToReactComponent } from "@webiny/app/utils";

export type CmsContentFormRendererPluginProps = Pick<
    BaseCmsContentFormRendererPlugin,
    "modelId" | "render"
>;

export const CmsContentFormRendererPlugin =
    legacyPluginToReactComponent<CmsContentFormRendererPluginProps>({
        pluginType: "cms-content-form-renderer",
        componentDisplayName: "CmsContentFormRendererPlugin"
    });
