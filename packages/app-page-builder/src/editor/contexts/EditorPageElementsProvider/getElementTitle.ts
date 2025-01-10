import { PbEditorPageElementPlugin } from "~/types";
import { plugins } from "@webiny/plugins";

const titlesCache: Record<string, string> = {};

/**
 * Returns element title from element's plugin. If plugin is not found, it will
 * return the element type. A simple cache was added to avoid unnecessary lookups.
 */
export const getElementTitle = (elementType: string, suffix?: string): string => {
    const cacheKey = [elementType, suffix].filter(Boolean).join(".");

    if (cacheKey in titlesCache) {
        return titlesCache[cacheKey];
    }

    titlesCache[cacheKey] = elementType;

    const elementEditorPlugin = plugins
        .byType<PbEditorPageElementPlugin>("pb-editor-page-element")
        .find(item => item.elementType === elementType);

    if (!elementEditorPlugin) {
        return titlesCache[cacheKey];
    }

    const toolbarTitle = elementEditorPlugin?.toolbar?.title;
    if (typeof toolbarTitle === "string") {
        titlesCache[cacheKey] = toolbarTitle;
    } else {
        // Upper-case first the type.
        titlesCache[cacheKey] = elementType.charAt(0).toUpperCase() + elementType.slice(1);
    }

    titlesCache[cacheKey] = suffix ? `${titlesCache[cacheKey]} | ${suffix}` : titlesCache[cacheKey];

    return titlesCache[cacheKey];
};
