import { useCallback } from "react";
import { useRecoilCallback } from "recoil";
import { blockByElementSelector } from "~/editor/hooks/useCurrentBlockElement";

/**
 * Exposes a getter which traverses the element tree upwards from the given element id, and returns an element
 * of type "block", if found.
 */
export const useFindElementBlock = () => {
    const findBlock = useRecoilCallback(({ snapshot }) => async (id: string) => {
        return await snapshot.getPromise(blockByElementSelector(id));
    });

    const findElementBlock = useCallback(
        async (elementId: string) => {
            return findBlock(elementId);
        },
        [findBlock]
    );

    return { findElementBlock };
};
