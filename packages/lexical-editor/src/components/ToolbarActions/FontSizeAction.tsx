import React, { useCallback, useEffect, useState } from "react";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { DropDown, DropDownItem } from "~/ui/DropDown";
import { useDeriveValueFromSelection } from "~/hooks/useCurrentSelection";
import { useRichTextEditor } from "~/hooks";

export interface FontSize {
    id: string;
    name: string;
    value: string;
}

export const FONT_SIZES_FALLBACK: FontSize[] = [
    "8px",
    "9px",
    "10px",
    "11px",
    "12px",
    "14px",
    "15px",
    "16px",
    "18px",
    "21px",
    "24px",
    "30px",
    "36px",
    "48px",
    "60px",
    "72px",
    "96px"
].map(size => ({
    id: size,
    name: size,
    value: size,
    default: size === "15px"
}));

const emptyOption: FontSize = {
    value: "",
    name: "Font Size",
    id: "empty"
};

function dropDownActiveClass(active: boolean) {
    if (active) {
        return "active dropdown-item-active";
    }
    return "";
}

interface FontSizeDropDownProps {
    fontSizes: FontSize[];
    editor: LexicalEditor;
    value: string | undefined;
    disabled?: boolean;
}

function FontSizeDropDown(props: FontSizeDropDownProps): JSX.Element {
    const { editor, value, fontSizes, disabled = false } = props;

    const handleClick = useCallback(
        (option: FontSize) => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $patchStyleText(selection, {
                        ["font-size"]: option.value
                    });
                }
            });
        },
        [editor]
    );

    const selectedOption = fontSizes.find(opt => opt.value === value) ?? emptyOption;

    return (
        <DropDown
            disabled={disabled}
            buttonClassName="toolbar-item font-size"
            buttonLabel={selectedOption.name}
            buttonAriaLabel={"Formatting options for font size"}
        >
            {fontSizes.map(option => (
                <DropDownItem
                    className={`item fontsize-item ${dropDownActiveClass(value === option.id)}`}
                    onClick={() => handleClick(option)}
                    key={option.id}
                >
                    <span className="text">{option.name}</span>
                </DropDownItem>
            ))}
        </DropDown>
    );
}

interface FontSizeActionProps {
    fontSizes?: FontSize[];
}

const FontSize = ({ fontSizes = FONT_SIZES_FALLBACK }: FontSizeActionProps) => {
    const { editor } = useRichTextEditor();
    const [isEditable, setIsEditable] = useState(() => editor.isEditable());
    const fontSize = useDeriveValueFromSelection(({ rangeSelection }) => {
        if (!rangeSelection) {
            return undefined;
        }
        try {
            return $getSelectionStyleValueForProperty(rangeSelection, "font-size");
        } catch {
            return undefined;
        }
    });

    useEffect(() => {
        return mergeRegister(
            editor.registerEditableListener(editable => {
                setIsEditable(editable);
            })
        );
    }, [editor]);

    return (
        <>
            <FontSizeDropDown
                disabled={!isEditable}
                value={fontSize}
                editor={editor}
                fontSizes={fontSizes}
            />
        </>
    );
};

export const FontSizeAction = Object.assign(FontSize, { FONT_SIZES_FALLBACK });
