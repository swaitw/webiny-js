import React from "react";
import { useUi } from "@webiny/app/hooks/useUi";
import { SnackbarAction } from "@webiny/ui/Snackbar";

interface UseSnackbarResponse {
    showSnackbar: (message: React.ReactNode, options?: Record<string, React.ReactNode>) => void;
    showErrorSnackbar: (
        message: React.ReactNode,
        options?: Record<string, React.ReactNode>
    ) => void;
    hideSnackbar: () => void;
}

export const useSnackbar = (): UseSnackbarResponse => {
    const ui = useUi();

    return {
        showSnackbar: (message, options = {}) => {
            ui.setState(ui => {
                return { ...ui, snackbar: { message, options } };
            });
        },
        showErrorSnackbar: (message, options = {}) => {
            ui.setState(ui => {
                return {
                    ...ui,
                    snackbar: {
                        message,
                        options: {
                            timeout: -1,
                            dismissesOnAction: true,
                            action: <SnackbarAction label={"OK"} />,
                            ...options
                        }
                    }
                };
            });
        },
        hideSnackbar: () => {
            ui.setState(ui => {
                return { ...ui, snackbar: null };
            });
        }
    };
};
