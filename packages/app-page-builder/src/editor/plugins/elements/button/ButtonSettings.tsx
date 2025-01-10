import React, { useCallback } from "react";
import { css } from "emotion";
import startCase from "lodash/startCase";
import { usePageElements } from "@webiny/app-page-builder-elements/hooks/usePageElements";
import { IconPicker } from "@webiny/app-admin/components/IconPicker";
import { PbEditorElement, PbEditorPageElementSettingsRenderComponentProps } from "~/types";
// Components
import { ICON_PICKER_SIZE } from "@webiny/app-admin/components/IconPicker/types";
import Accordion from "../../elementSettings/components/Accordion";
import { ContentWrapper } from "../../elementSettings/components/StyledComponents";
import Wrapper from "../../elementSettings/components/Wrapper";
import InputField from "../../elementSettings/components/InputField";
import SelectField from "../../elementSettings/components/SelectField";
import useUpdateHandlers from "../../elementSettings/useUpdateHandlers";
import { useActiveElement } from "~/editor";
import { useUpdateIconSettings } from "~/editor/plugins/elementSettings/hooks/useUpdateIconSettings";

const classes = {
    gridClass: css({
        "&.mdc-layout-grid": {
            padding: 0,
            margin: 0,
            marginBottom: 24
        }
    }),
    row: css({
        display: "flex",
        "& > div": {
            width: "50%",
            background: "beige"
        },

        "& .icon-picker-handler": {
            width: "100%",
            backgroundColor: "var(--webiny-theme-color-background)",
            "& svg": {
                width: 24,
                height: 24
            }
        },
        "& .color-picker-handler": {
            width: "100%",
            backgroundColor: "var(--webiny-theme-color-background)",
            "& > div": {
                width: "100%"
            }
        }
    }),
    rightCellStyle: css({
        justifySelf: "end"
    })
};

const ButtonSettings = ({
    defaultAccordionValue
}: PbEditorPageElementSettingsRenderComponentProps) => {
    const [element] = useActiveElement<PbEditorElement>();
    const { iconWidth, iconValue, onIconChange, onIconWidthChange, HiddenIconMarkup } =
        useUpdateIconSettings(element);

    const { theme } = usePageElements();
    const types = Object.keys(theme.styles?.button || {});
    const typesOptions = types.map(item => ({
        value: item,
        label: startCase(item)
    }));

    const defaultType = typesOptions[0].value;
    const { type = defaultType, icon } = element.data || {};

    const { getUpdateValue } = useUpdateHandlers({
        element,
        dataNamespace: "data"
    });

    const updateType = useCallback(
        (value: string) => getUpdateValue("type")(value),
        [getUpdateValue]
    );

    const updateIconPosition = useCallback(
        (value: string) => getUpdateValue("icon.position")(value),
        [getUpdateValue]
    );

    return (
        <Accordion title={"Button"} defaultValue={defaultAccordionValue}>
            <ContentWrapper direction={"column"}>
                <Wrapper label={"Type"} containerClassName={classes.gridClass}>
                    <SelectField value={type} onChange={updateType}>
                        {typesOptions.map(t => (
                            <option key={t.value} value={t.value}>
                                {t.label}
                            </option>
                        ))}
                    </SelectField>
                </Wrapper>
                <Wrapper label={"Icon"} containerClassName={classes.gridClass}>
                    <IconPicker
                        size={ICON_PICKER_SIZE.SMALL}
                        value={iconValue}
                        onChange={onIconChange}
                        removable
                    />
                </Wrapper>
                <Wrapper
                    label={"Icon width"}
                    containerClassName={classes.gridClass}
                    leftCellSpan={8}
                    rightCellSpan={4}
                >
                    <InputField
                        placeholder={"Width"}
                        value={iconWidth}
                        onChange={onIconWidthChange}
                    />
                </Wrapper>
                <Wrapper
                    label={"Icon position"}
                    containerClassName={classes.gridClass}
                    leftCellSpan={8}
                    rightCellSpan={4}
                >
                    <SelectField value={icon?.position || "left"} onChange={updateIconPosition}>
                        <option value={"left"}>Left</option>
                        <option value={"right"}>Right</option>
                        <option value={"top"}>Top</option>
                        <option value={"bottom"}>Bottom</option>
                    </SelectField>
                </Wrapper>
                {/* Renders IconPicker.Icon for accessing its HTML without displaying it. */}
                <HiddenIconMarkup />
            </ContentWrapper>
        </Accordion>
    );
};

export default ButtonSettings;
