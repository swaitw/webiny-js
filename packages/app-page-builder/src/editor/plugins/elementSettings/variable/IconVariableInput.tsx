import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useVariable } from "~/hooks/useVariable";
import { IconPicker } from "@webiny/app-admin/components/IconPicker";
import { ICON_PICKER_SIZE, Icon } from "@webiny/app-admin/components/IconPicker/types";
import { useIconMarkup } from "~/editor/plugins/elementSettings/hooks/useIconMarkup";

const Wrapper = styled.div`
    & > div {
        justify-content: start;
    }
`;

interface IconVariableInputProps {
    variableId: string;
}

const IconVariableInput = ({ variableId }: IconVariableInputProps) => {
    const { value, onChange } = useVariable<{ icon: Icon; markup: string; width: number }>(
        variableId
    );

    const { render, HiddenIconMarkup } = useIconMarkup(({ icon, markup }) => {
        onChange({ icon, markup, width: value?.width }, true);
    });

    const [iconValue, setIconValue] = useState<Icon | undefined>(undefined);

    useEffect(() => {
        setIconValue(value.icon);
    }, [value.icon]);

    useEffect(() => {
        render({ icon: iconValue, width: value.width });
    }, [iconValue]);

    return (
        <Wrapper>
            <IconPicker size={ICON_PICKER_SIZE.SMALL} value={iconValue} onChange={setIconValue} />
            <HiddenIconMarkup />
        </Wrapper>
    );
};

export default IconVariableInput;
