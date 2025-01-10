import React from "react";
import { useActiveElement } from "~/editor";

export interface OnElementTypeProps {
    elementType: string;
    children: React.ReactNode;
}

export const OnElementType = ({ elementType, children }: OnElementTypeProps) => {
    const [element] = useActiveElement();

    if (element?.type === elementType) {
        return <>{children}</>;
    }

    return null;
};
