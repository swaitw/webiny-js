import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import { i18n } from "@webiny/app/i18n";
import { IconButton } from "@webiny/ui/Button";
import { Cell } from "@webiny/ui/Grid";
import {
    BindComponentRenderProp,
    CmsModelFieldRendererPlugin,
    CmsModelFieldRendererProps
} from "~/types";
import DynamicSection from "../DynamicSection";
import { Fields } from "~/admin/components/ContentEntryForm/Fields";
import { ReactComponent as DeleteIcon } from "~/admin/icons/close.svg";
import { ReactComponent as ArrowUp } from "./arrow_drop_up.svg";
import { ReactComponent as ArrowDown } from "./arrow_drop_down.svg";
import Accordion from "~/admin/plugins/fieldRenderers/Accordion";
import {
    fieldsWrapperStyle,
    dynamicSectionGridStyle,
    fieldsGridStyle,
    ItemHighLight,
    ObjectItem
} from "./StyledComponents";
import { generateAlphaNumericLowerCaseId } from "@webiny/utils";
import { FieldSettings } from "~/admin/plugins/fieldRenderers/object/FieldSettings";
import { useConfirmationDialog } from "@webiny/app-admin";

const t = i18n.ns("app-headless-cms/admin/fields/text");

interface ActionsProps {
    setHighlightIndex: Dispatch<SetStateAction<{ [key: number]: string }>>;
    index: number;
    bind: {
        index: BindComponentRenderProp;
        field: BindComponentRenderProp;
    };
}

const Actions = ({ setHighlightIndex, bind, index }: ActionsProps) => {
    const { showConfirmation } = useConfirmationDialog({
        message: `Are you sure you want to delete this item? This action is not reversible.`,
        acceptLabel: `Yes, I'm sure!`,
        cancelLabel: `No, leave it.`
    });

    const { moveValueDown, moveValueUp } = bind.field;

    const onDown = useCallback(
        (ev: React.BaseSyntheticEvent) => {
            ev.stopPropagation();
            moveValueDown(index);
            setHighlightIndex(map => ({
                ...map,
                [index + 1]: generateAlphaNumericLowerCaseId(12)
            }));
        },
        [moveValueDown, index]
    );

    const onUp = useCallback(
        (ev: React.BaseSyntheticEvent) => {
            ev.stopPropagation();
            moveValueUp(index);
            setHighlightIndex(map => ({
                ...map,
                [index - 1]: generateAlphaNumericLowerCaseId(12)
            }));
        },
        [moveValueUp, index]
    );

    const onDelete = (ev: React.BaseSyntheticEvent) => {
        ev.stopPropagation();
        showConfirmation(() => {
            bind.field.removeValue(index);
        });
    };

    return (
        <>
            <IconButton icon={<ArrowDown />} onClick={onDown} />
            <IconButton icon={<ArrowUp />} onClick={onUp} />
            <IconButton icon={<DeleteIcon />} onClick={onDelete} />
        </>
    );
};

const ObjectsRenderer = (props: CmsModelFieldRendererProps) => {
    const [highlightMap, setHighlightIndex] = useState<{ [key: number]: string }>({});
    const { field, contentModel } = props;

    const fieldSettings = FieldSettings.createFrom(field);

    if (!fieldSettings.hasFields()) {
        fieldSettings.logMissingFields();
        return null;
    }

    const settings = fieldSettings.getSettings();

    return (
        <DynamicSection {...props} emptyValue={{}} gridClassName={dynamicSectionGridStyle}>
            {({ Bind, bind, index }) => (
                <ObjectItem>
                    {highlightMap[index] ? <ItemHighLight key={highlightMap[index]} /> : null}
                    <Accordion
                        title={`${props.field.label} #${index + 1}`}
                        action={
                            <Actions
                                setHighlightIndex={setHighlightIndex}
                                index={index}
                                bind={bind}
                            />
                        }
                        // Open first Accordion by default
                        defaultValue={index === 0}
                    >
                        <Cell span={12} className={fieldsWrapperStyle}>
                            <Fields
                                Bind={Bind}
                                contentModel={contentModel}
                                fields={settings.fields}
                                layout={settings.layout}
                                gridClassName={fieldsGridStyle}
                            />
                        </Cell>
                    </Accordion>
                </ObjectItem>
            )}
        </DynamicSection>
    );
};

const plugin: CmsModelFieldRendererPlugin = {
    type: "cms-editor-field-renderer",
    name: "cms-editor-field-renderer-objects",
    renderer: {
        rendererName: "objects",
        name: t`Inline Form`,
        description: t`Renders a set of fields.`,
        canUse({ field }) {
            return field.type === "object" && Boolean(field.multipleValues);
        },
        render(props) {
            return <ObjectsRenderer {...props} />;
        }
    }
};

export default plugin;
