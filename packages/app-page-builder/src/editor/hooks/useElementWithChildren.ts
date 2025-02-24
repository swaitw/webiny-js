import { useRecoilValue } from "recoil";
import type { Element } from "@webiny/app-page-builder-elements/types";
import { elementWithChildrenByIdSelector } from "~/editor/recoil/modules";

export const useElementWithChildren = (elementId: string) => {
    const element = useRecoilValue(elementWithChildrenByIdSelector(elementId));
    if (!element) {
        return null;
    }

    return element as Element;
};
