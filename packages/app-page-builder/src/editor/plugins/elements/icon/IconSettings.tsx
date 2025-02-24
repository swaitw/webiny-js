import React from "react";
import { css } from "emotion";
import { PbEditorElement, PbEditorPageElementSettingsRenderComponentProps } from "~/types";
// Components
import { IconPicker } from "@webiny/app-admin/components/IconPicker";
import { ICON_PICKER_SIZE } from "@webiny/app-admin/components/IconPicker/types";
import Accordion from "../../elementSettings/components/Accordion";
import Wrapper from "../../elementSettings/components/Wrapper";
import InputField from "../../elementSettings/components/InputField";
import { useActiveElement } from "~/editor";
import { useUpdateIconSettings } from "~/editor/plugins/elementSettings/hooks/useUpdateIconSettings";

const classes = {
    grid: css({
        "&.mdc-layout-grid": {
            padding: 0,
            marginBottom: 24
        }
    }),
    widthInputStyle: css({
        maxWidth: 60
    }),
    rightCellStyle: css({
        justifySelf: "end"
    })
};

const IconSettings = ({
    defaultAccordionValue
}: PbEditorPageElementSettingsRenderComponentProps) => {
    const [activeElement] = useActiveElement<PbEditorElement>();
    const { iconWidth, iconValue, onIconChange, onIconWidthChange, HiddenIconMarkup } =
        useUpdateIconSettings(activeElement);

    return (
        <Accordion title={"Icon"} defaultValue={defaultAccordionValue}>
            <>
                <Wrapper
                    containerClassName={classes.grid}
                    label={"Icon"}
                    rightCellClassName={classes.rightCellStyle}
                >
                    <IconPicker
                        size={ICON_PICKER_SIZE.SMALL}
                        value={iconValue}
                        onChange={onIconChange}
                    />
                </Wrapper>
                <Wrapper
                    containerClassName={classes.grid}
                    label={"Width"}
                    leftCellSpan={8}
                    rightCellSpan={4}
                    rightCellClassName={classes.rightCellStyle}
                >
                    <InputField
                        className={classes.widthInputStyle}
                        value={iconWidth}
                        onChange={onIconWidthChange}
                        placeholder="50"
                    />
                </Wrapper>
                <HiddenIconMarkup />
            </>
        </Accordion>
    );
};

export default React.memo(IconSettings);
