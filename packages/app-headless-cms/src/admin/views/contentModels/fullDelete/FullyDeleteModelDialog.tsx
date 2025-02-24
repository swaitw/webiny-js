import React, { useCallback, useMemo } from "react";
import {
    Dialog,
    DialogActions,
    DialogCancel,
    DialogContent,
    DialogTitle
} from "~/admin/components/Dialog";
import type { CmsModel } from "~/types";
import { ButtonPrimary } from "@webiny/ui/Button";
import { FullyDeleteModelStateStatus } from "./types";
import { Content } from "./dialog/Content";
import { createValidationValue } from "./dialog/validationValue";
import { createProcessConfirmation } from "./dialog/process";
import { useApolloClient } from "~/admin/hooks";
import { useDialogState } from "./dialog/state";
import { updateModelInCache } from "~/admin/views/contentModels/cache";

export interface FullyDeleteModelDialogProps {
    model: CmsModel | null;
    onClose: () => void;
}

/**
 * It's not a mistake to use cancel to accept and accept to cancel. It is just a matter of styling.
 * We want the accept button to be less visible.
 */
export const FullyDeleteModelDialog = ({
    model: inputModel,
    onClose
}: FullyDeleteModelDialogProps) => {
    const client = useApolloClient();

    const state = useDialogState(inputModel);

    const {
        model,
        status,
        confirmation,
        setConfirmation,
        setStatusUnderstood,
        setStatusProcessed,
        setStatusConfirmed,
        setStatusError,
        setError
    } = state;

    const processConfirmation = useMemo(() => {
        return createProcessConfirmation({
            client
        });
    }, [client]);

    const startProcessing = useCallback(() => {
        const value = createValidationValue(model!);
        if (confirmation !== value) {
            setError({
                message: "Confirmation value is not correct.",
                code: "CONFIRMATION_ERROR"
            });
            return;
        }
        setStatusConfirmed();

        (async () => {
            const result = await processConfirmation({
                model: model!,
                confirmation,
                onSuccess: cache => {
                    updateModelInCache(cache, {
                        ...model!,
                        isBeingDeleted: true
                    });
                }
            });
            if (result.error) {
                setStatusError(result.error);
                return;
            }

            setStatusProcessed(result.data);
        })();
    }, [state]);

    const title = useMemo(() => {
        if (model?.plugin) {
            return "Delete all entries of the model?";
        }
        return "Delete content model and all its entries?";
    }, [model?.modelId]);

    const primaryButtonText = useMemo(() => {
        if (status === FullyDeleteModelStateStatus.UNDERSTOOD) {
            return "Yes, delete the model";
        }
        return "Yes, I understand";
    }, [status]);

    const onYesClick = useMemo(() => {
        if (status === FullyDeleteModelStateStatus.NONE) {
            return setStatusUnderstood;
        }
        return startProcessing;
    }, [setStatusUnderstood, startProcessing, status]);

    return (
        <Dialog
            open={!!model}
            onClose={onClose}
            preventOutsideDismiss={true}
            data-testid="cms-delete-content-model-dialog"
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Content
                    model={model}
                    setConfirmation={setConfirmation}
                    confirmation={confirmation}
                    error={state.error}
                    status={status}
                />
            </DialogContent>
            <DialogActions>
                <DialogCancel data-testid="cms-delete-content-model-close-button">
                    {status === FullyDeleteModelStateStatus.PROCESSED ||
                    status === FullyDeleteModelStateStatus.ERROR
                        ? "OK"
                        : "Cancel"}
                </DialogCancel>
                {(status === FullyDeleteModelStateStatus.NONE ||
                    status === FullyDeleteModelStateStatus.UNDERSTOOD) && (
                    <ButtonPrimary
                        data-testid="cms-delete-content-model-confirm-button"
                        onClick={onYesClick}
                    >
                        {primaryButtonText}
                    </ButtonPrimary>
                )}
            </DialogActions>
        </Dialog>
    );
};
