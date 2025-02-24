import React from "react";
import { IconPicker as IconPickerComponent, Icon } from "@webiny/app-admin/components/IconPicker";
import { Typography } from "@webiny/ui/Typography";
import { Cell } from "@webiny/ui/Grid";

interface IconPickerProps {
    label: string;
    value: Icon | undefined;
    updateValue: (item: Icon | undefined) => void;
}

const IconPicker = ({ label, value, updateValue }: IconPickerProps) => {
    return (
        <>
            <Cell span={4}>
                <Typography use={"overline"}>{label}</Typography>
            </Cell>
            <Cell span={8}>
                <IconPickerComponent value={value} onChange={updateValue} />
            </Cell>
        </>
    );
};

export default React.memo(IconPicker);
