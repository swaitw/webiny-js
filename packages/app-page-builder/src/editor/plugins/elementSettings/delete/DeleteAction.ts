import React, { useCallback } from "react";
import { useActiveElement, useDeleteElement } from "~/editor";

interface DeleteActionPropsType {
    children: React.ReactElement;
}
const DeleteAction = ({ children }: DeleteActionPropsType) => {
    const [element] = useActiveElement();
    const { deleteElement, canDeleteElement } = useDeleteElement();

    const onClick = useCallback((): void => {
        if (!element) {
            return;
        }

        if (canDeleteElement(element)) {
            deleteElement(element);
        }
    }, [element?.id]);

    return React.cloneElement(children, { onClick });
};

export default React.memo(DeleteAction);
