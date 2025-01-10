import { useCallback, useEffect, useState } from "react";
import type { IFullyDeleteModelState } from "../types";
import { FullyDeleteModelStateStatus } from "../types";
import type { CmsErrorResponse, CmsModel } from "@webiny/app-headless-cms-common/types";
import { IDeleteCmsModelTask } from "~/admin/viewsGraphql";

const defaultState: IFullyDeleteModelState = {
    confirmation: "",
    status: FullyDeleteModelStateStatus.NONE,
    model: null,
    error: null,
    task: null
};

export const useDialogState = (input: CmsModel | null) => {
    const [state, setState] = useState(defaultState);

    const reset = useCallback(() => {
        setState(defaultState);
    }, [setState]);

    const setModel = useCallback(
        (model: CmsModel | null) => {
            setState(prev => {
                return {
                    ...prev,
                    model
                };
            });
        },
        [setState]
    );

    const setStatusUnderstood = useCallback(() => {
        setState(prev => {
            return {
                ...prev,
                error: null,
                status: FullyDeleteModelStateStatus.UNDERSTOOD
            };
        });
    }, [setState]);

    const setStatusConfirmed = useCallback(() => {
        setState(prev => {
            return {
                ...prev,
                error: null,
                status: FullyDeleteModelStateStatus.CONFIRMED
            };
        });
    }, [setState]);

    const setStatusProcessed = useCallback(
        (task: IDeleteCmsModelTask) => {
            setState(prev => {
                return {
                    ...prev,
                    task,
                    status: FullyDeleteModelStateStatus.PROCESSED
                };
            });
        },
        [setState]
    );

    const setStatusError = useCallback(
        (error: CmsErrorResponse) => {
            setState(prev => {
                return {
                    ...prev,
                    error,
                    status: FullyDeleteModelStateStatus.ERROR
                };
            });
        },
        [setState]
    );

    const setError = useCallback(
        (error: CmsErrorResponse) => {
            setState(prev => {
                return {
                    ...prev,
                    error
                };
            });
        },
        [setState]
    );

    const setConfirmation = useCallback(
        (value: string) => {
            setState(prev => {
                return {
                    ...prev,
                    confirmation: value
                };
            });
        },
        [setState]
    );

    useEffect(() => {
        if (input === null) {
            reset();
            return;
        }

        setModel(input);
    }, [input?.modelId]);

    return {
        status: state.status,
        model: state.model,
        confirmation: state.confirmation,
        error: state.error,
        task: state.task,
        reset,
        setModel,
        setError,
        setStatusUnderstood,
        setStatusConfirmed,
        setStatusProcessed,
        setConfirmation,
        setStatusError
    };
};
