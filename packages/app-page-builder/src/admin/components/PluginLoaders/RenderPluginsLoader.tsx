import { createPluginsLoader } from "~/admin/components/PluginLoaders/createPluginsLoader";

export const RenderPluginsLoader = createPluginsLoader({
    type: "pb-render-page-element",
    factory: plugin => {
        return plugin.loadRenderPlugins ? plugin.loadRenderPlugins() : undefined;
    }
});
