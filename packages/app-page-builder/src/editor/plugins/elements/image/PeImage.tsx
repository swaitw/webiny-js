import React, { useCallback } from "react";
import { FileManager, SingleImageUploadProps } from "@webiny/app-admin";
import { ImageRenderer } from "@webiny/app-page-builder-elements/renderers/image";
import { AddImageIconWrapper, AddImageWrapper } from "@webiny/ui/ImageUpload/styled";
import { ReactComponent as AddImageIcon } from "@webiny/ui/ImageUpload/icons/round-add_photo_alternate-24px.svg";
import { Typography } from "@webiny/ui/Typography";
import { UpdateElementActionEvent } from "~/editor/recoil/actions";
import { useEventActionHandler } from "~/editor/hooks/useEventActionHandler";
import { PbElement } from "~/types";

const RenderBlank = (props: { onClick?: () => void }) => {
    return (
        <AddImageWrapper data-role={"select-image"} onClick={props.onClick}>
            <AddImageIconWrapper>
                <AddImageIcon />
                <Typography use={"caption"}>Select an image</Typography>
            </AddImageIconWrapper>
        </AddImageWrapper>
    );
};

const emptyLink = { href: "" };

interface PeImageProps {
    element: PbElement;
    [key: string]: any;
}

export const PeImage = ({ element, ...rest }: PeImageProps) => {
    const handler = useEventActionHandler();

    const id = element.id;

    const onChange = useCallback<NonNullable<SingleImageUploadProps["onChange"]>>(
        file => {
            const elementClone = structuredClone(element);
            if (file) {
                const { id, src } = file;
                elementClone.data.image = {
                    ...elementClone.data.image,
                    file: { id, src },
                    htmlTag: "auto"
                };
            }

            handler.trigger(
                new UpdateElementActionEvent({
                    element: elementClone,
                    history: true
                })
            );
        },
        [id]
    );

    return (
        <FileManager
            onChange={onChange}
            render={({ showFileManager }) => (
                <ImageRenderer
                    element={element}
                    onClick={showFileManager}
                    renderEmpty={<RenderBlank onClick={showFileManager} />}
                    // Even if the link might've been applied via the right sidebar, we still don't
                    // want to have it rendered in the editor. Because, otherwise, user wouldn't be
                    // able to click again on the component and bring back the file manager overlay.
                    link={emptyLink}
                    {...rest}
                />
            )}
        />
    );
};
