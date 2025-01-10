import { useEffect, useState } from "react";
import { PbEditorElement, PbElementDataIconV2 } from "~/types";
import { useUpdateHandlers } from "~/editor";
import { replaceFullIconObject } from "~/editor/plugins/elements/utils/iconUtils";
import { useIconMarkup } from "~/editor/plugins/elementSettings/hooks/useIconMarkup";
import { Icon } from "@webiny/app-admin";

const DEFAULT_WIDTH = 36;

export const useUpdateIconSettings = (element: PbEditorElement) => {
    const { data } = element;
    const iconSettings = data.icon;

    const [icon, setIcon] = useState<Icon | undefined>(iconSettings?.icon);
    const [width, setWidth] = useState<number>(iconSettings?.width ?? DEFAULT_WIDTH);

    const { getUpdateValue } = useUpdateHandlers({
        element,
        dataNamespace: "data",
        postModifyElement: replaceFullIconObject
    });

    const markup = useIconMarkup(({ icon, width, markup }) => {
        const updateValue = getUpdateValue<PbElementDataIconV2 | null>("icon");

        updateValue({
            icon,
            width,
            markup
        });
    });

    useEffect(() => {
        markup.render({ icon, width });
    }, [icon, width]);

    useEffect(() => {
        setIcon(iconSettings?.icon);
        setWidth(iconSettings?.width ?? DEFAULT_WIDTH);
    }, [element.id]);

    return {
        iconValue: icon,
        iconWidth: width,
        onIconChange: setIcon,
        onIconWidthChange: (value: string) => {
            setWidth(value === "" ? DEFAULT_WIDTH : parseInt(value));
        },
        HiddenIconMarkup: markup.HiddenIconMarkup
    };
};
