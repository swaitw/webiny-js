import React, { useState, useRef, useEffect } from "react";
import { IconPicker } from "@webiny/app-admin";
import { Icon } from "@webiny/app-admin/components/IconPicker/types";
import { HiddenDiv } from "~/editor/components/HiddenDiv";

interface OnMarkup {
    (params: { icon: Icon; width: number | undefined; markup: string }): void;
}

interface RenderIcon {
    icon: Icon | undefined;
    width: number | undefined;
}

export const useIconMarkup = (onMarkup: OnMarkup) => {
    const iconRef = useRef<HTMLDivElement>(null);
    const [{ icon, width }, setIcon] = useState<RenderIcon>({
        icon: undefined,
        width: undefined
    });

    useEffect(() => {
        if (!iconRef.current || !icon) {
            return;
        }

        const newMarkup = iconRef.current.innerHTML;

        onMarkup({ icon, width, markup: newMarkup });
    }, [icon, width]);

    const HiddenIconMarkup = () => {
        return (
            <HiddenDiv ref={iconRef}>
                <IconPicker.Icon icon={icon} size={width} />
            </HiddenDiv>
        );
    };

    const render = (params: RenderIcon) => {
        setIcon(params);
    };

    return {
        render,
        HiddenIconMarkup
    };
};
