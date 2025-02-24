import { useContext } from "react";
import { DynamicDocumentContext } from "./DynamicDocumentProvider";

export const useDynamicDocument = () => {
    const context = useContext(DynamicDocumentContext);
    if (!context) {
        throw Error(`Missing DynamicDocumentProvider in the component hierarchy!`);
    }

    return context;
};
