import { plugins } from "@webiny/plugins";
import type { Renderer } from "@webiny/app-page-builder-elements/types";
import type { PbEditorElement, PbRenderElementPlugin } from "~/types";

/**
 * Gets element renderer inputs. These are defined for each individual renderer, when using
 * `createRenderer` factory function.
 */
export const useElementRendererInputs = (element: PbEditorElement | null) => {
    const renderers = plugins
        .byType<PbRenderElementPlugin>("pb-render-page-element")
        .reduce<Record<string, Renderer>>((current, item) => {
            return { ...current, [item.elementType]: item.render };
        }, {});

    if (!element) {
        return { inputs: [] };
    }

    const renderer = renderers[element.type];

    return { inputs: renderer && renderer.inputs ? Object.values(renderer.inputs) : [] };
};
