import React, { useCallback } from "react";
import { BindingContext } from "./BindingProvider";

export const useBindingContext = () => {
    const binding = React.useContext(BindingContext);

    const getRelativePath = useCallback(
        (path: string) => {
            if (!binding || binding.bindFrom === "*") {
                return path;
            }

            return path.replace(new RegExp(`^${binding.bindFrom}\\.`), "");
        },
        [binding]
    );

    return { binding, getRelativePath };
};
