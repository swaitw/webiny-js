import styled from "@emotion/styled";
import React, { useCallback, useState } from "react";
import type { CmsModel } from "@webiny/app-headless-cms-common/types";
import { ButtonPrimary } from "@webiny/ui/Button";
import { i18n } from "@webiny/app/i18n";
import { useConfirmationDialog } from "@webiny/app-admin";
import { useCancelDelete } from "~/admin/views/contentModels/fullDelete/useCancelDelete";

const t = i18n.ns("app-headless-cms/admin/views/content-models/fully-delete-model");

export interface IModelOverlayProps {
    model: CmsModel;
}

const Wrap = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-grow: 1;
    min-width: 130px;
`;

const CancelDelete = ({ model }: IModelOverlayProps) => {
    const { cancel } = useCancelDelete({ model });
    const { showConfirmation } = useConfirmationDialog({
        title: "Stop the model and entries delete process?",
        message: "Are you sure you want to stop the model and entries delete process?",
        acceptLabel: "Yes, I am sure.",
        cancelLabel: "No, keep deleting."
    });

    const onClick = useCallback(() => {
        showConfirmation(async () => {
            await cancel();
        });
    }, [showConfirmation, model.modelId]);

    return (
        <>
            <ButtonPrimary onClick={onClick}>{t`Cancel delete`}</ButtonPrimary>
        </>
    );
};

export const ModelIsBeingDeleted = ({
    model,
    children
}: React.PropsWithChildren<IModelOverlayProps>) => {
    const [over, setOver] = useState(false);

    const onMouseEnter = useCallback(() => {
        setOver(true);
    }, [setOver]);

    const onMouseLeave = useCallback(() => {
        setOver(false);
    }, [setOver]);

    if (!model.isBeingDeleted) {
        return <>{children}</>;
    }
    const message = model.plugin ? "Records are being deleted." : "Model is being deleted.";
    return (
        <Wrap onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {!over && <>{message}</>}
            {over && <CancelDelete model={model} />}
        </Wrap>
    );
};
