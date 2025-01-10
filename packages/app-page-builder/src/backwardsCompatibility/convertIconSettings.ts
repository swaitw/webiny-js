import type { Element as ElementType } from "@webiny/app-page-builder-elements/types";
import type { PbElementDataIconV1, PbElementDataIconV2 } from "~/types";

type ElementWithIcon = ElementType<{ icon: PbElementDataIconV1 | PbElementDataIconV2 }>;

export const legacyMap: Record<string, string> = {
    fab: "fa6_brands",
    far: "fa6_regular",
    fas: "fa6_solid"
};

const legacyIconIdToName = (id: string[]) => {
    return `${legacyMap[id[0]]}_${id[1]}`;
};

const convertIconToV2 = (icon: PbElementDataIconV1) => {
    const newIcon = {
        icon: {
            name: legacyIconIdToName(icon.id),
            type: "icon",
            value: "",
            color: icon.color
        },
        width: parseInt(icon.width),
        markup: icon.svg
    };

    if ("position" in icon) {
        return { ...newIcon, position: icon.position };
    }

    return newIcon;
};

export const convertIconSettings = (element: ElementType) => {
    const icon = (element as ElementWithIcon).data.icon;

    if (!icon) {
        return element;
    }

    if ("id" in icon) {
        return { ...element, data: { ...element.data, icon: convertIconToV2(icon) } };
    }

    return element;
};
