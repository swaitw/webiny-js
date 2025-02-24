import React from "react";
import type { CmsErrorResponse, CmsModel } from "~/types";
import { FullyDeleteModelStateStatus } from "../types";
import { Information } from "./Information";
import { Confirmation } from "./Confirmation";
import { CircularProgress } from "@webiny/ui/Progress";
import { Processed } from "./Processed";

export interface IContentProps {
    model: CmsModel | null;
    confirmation: string;
    setConfirmation: (value: string) => void;
    error: CmsErrorResponse | null;
    status: FullyDeleteModelStateStatus;
}

export const Content = ({ confirmation, setConfirmation, error, model, status }: IContentProps) => {
    if (!model) {
        return <p>Model not found.</p>;
    } else if (status === FullyDeleteModelStateStatus.NONE) {
        return <Information model={model} />;
    } else if (status === FullyDeleteModelStateStatus.PROCESSED) {
        return <Processed model={model} />;
    }

    return (
        <>
            {status === FullyDeleteModelStateStatus.CONFIRMED && (
                <CircularProgress label={"Starting the deletion process..."} />
            )}
            <Confirmation
                model={model}
                setConfirmation={setConfirmation}
                confirmation={confirmation}
                error={error}
            />
        </>
    );
};
