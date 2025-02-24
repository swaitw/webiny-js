import React from "react";
import classSet from "classnames";
import { css } from "emotion";
import styled from "@emotion/styled";
import { i18n } from "@webiny/app/i18n";
import { Cell, Grid } from "@webiny/ui/Grid";
import { Typography } from "@webiny/ui/Typography";
import { ButtonDefault, ButtonIcon } from "@webiny/ui/Button";
import { FormElementMessage } from "@webiny/ui/FormElementMessage";
import { ReactComponent as AddIcon } from "@webiny/app-admin/assets/icons/add-18px.svg";
import { GetBindCallable } from "~/admin/components/ContentEntryForm/useBind";
import { ParentFieldProvider } from "~/admin/hooks";
import { ParentValueIndexProvider } from "~/admin/components/ModelFieldProvider";
import { BindComponent, BindComponentRenderProp, CmsModelField } from "~/types";

const t = i18n.ns("app-headless-cms/admin/fields/text");

const style = {
    gridContainer: css`
        padding: 0 !important;
    `
};

export interface DynamicSectionPropsChildrenParams {
    Bind: BindComponent;
    field: CmsModelField;
    bind: {
        index: BindComponentRenderProp;
        field: BindComponentRenderProp;
    };
    index: number;
}

export interface DynamicSectionProps {
    field: CmsModelField;
    getBind: GetBindCallable;
    showLabel?: boolean;
    children: (params: DynamicSectionPropsChildrenParams) => JSX.Element;
    emptyValue?: any;
    gridClassName?: string;
}

const FieldLabel = styled.div`
    font-size: 24px;
    font-weight: normal;
    border-bottom: 1px solid var(--mdc-theme-background);
    margin-bottom: 20px;
    padding-bottom: 5px;
`;

const AddButtonCell = styled(Cell)<{ items: number }>`
    width: 100%;
    padding-top: ${({ items }) => (items > 0 ? "8px" : "0")};
    border-top: ${({ items }) => (items > 0 ? "1px solid var(--mdc-theme-background)" : "none")};
`;

const DynamicSection = ({
    field,
    getBind,
    children,
    showLabel = true,
    emptyValue = "",
    gridClassName
}: DynamicSectionProps) => {
    const Bind = getBind();

    return (
        /* First we mount the top level field, for example: "items" */
        <Bind>
            {bindField => {
                /**
                 * "value" -> an array of items
                 * "appendValue" -> a callback to add a new value to the top level "items" array
                 */
                const { value, appendValue } = bindField;

                const bindFieldValue: string[] = value || [];

                return (
                    <ParentFieldProvider value={value} path={Bind.parentName}>
                        {showLabel ? (
                            <FieldLabel>
                                <Typography use={"headline5"}>
                                    {`${field.label} ${
                                        bindFieldValue.length ? `(${bindFieldValue.length})` : ""
                                    }`}
                                </Typography>
                                {field.helpText && (
                                    <FormElementMessage>{field.helpText}</FormElementMessage>
                                )}
                            </FieldLabel>
                        ) : null}
                        <Grid className={classSet(gridClassName, style.gridContainer)}>
                            {bindFieldValue.map((_, index) => {
                                const BindField = getBind(index);
                                return (
                                    <Cell span={12} key={index}>
                                        <BindField>
                                            {bindProps => (
                                                <ParentValueIndexProvider index={index}>
                                                    {children({
                                                        Bind: BindField,
                                                        field,
                                                        bind: {
                                                            index: bindProps,
                                                            field: bindField
                                                        },
                                                        index
                                                    })}
                                                </ParentValueIndexProvider>
                                            )}
                                        </BindField>
                                    </Cell>
                                );
                            })}

                            {bindField.validation.isValid === false && (
                                <Cell span={12}>
                                    <FormElementMessage error>
                                        {bindField.validation.message}
                                    </FormElementMessage>
                                </Cell>
                            )}
                            <AddButtonCell span={12} items={bindFieldValue.length}>
                                <ButtonDefault onClick={() => appendValue(emptyValue)}>
                                    <ButtonIcon icon={<AddIcon />} />
                                    {t`Add value`}
                                </ButtonDefault>
                            </AddButtonCell>
                        </Grid>
                    </ParentFieldProvider>
                );
            }}
        </Bind>
    );
};

export default DynamicSection;
