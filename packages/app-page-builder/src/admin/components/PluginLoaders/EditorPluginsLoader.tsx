import { createPluginsLoader } from "~/admin/components/PluginLoaders/createPluginsLoader";

export const EditorPluginsLoader = createPluginsLoader({
    type: "pb-editor-page-element",
    factory: plugin => {
        return plugin.loadEditorPlugins ? plugin.loadEditorPlugins() : undefined;
    }
});
