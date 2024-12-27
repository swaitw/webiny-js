import { CmsModel } from "@webiny/api-headless-cms/types";
import { WebinyError } from "@webiny/error";
import { HcmsTasksContext } from "~/types";

export interface IAttachLifecycleEventsParams {
    context: HcmsTasksContext;
}

interface ICbParams {
    model: Pick<CmsModel, "modelId" | "name">;
}

export const attachLifecycleEvents = ({ context }: IAttachLifecycleEventsParams): void => {
    const blockActionOnEvent = async (params: ICbParams): Promise<void> => {
        const { model } = params;
        const isBeingDeleted = await context.cms.isModelBeingDeleted(model.modelId);
        if (!isBeingDeleted) {
            return;
        }

        throw new WebinyError(
            `Model "${model.name}" is being deleted and you cannot create, update or delete any entries of this model.`
        );
    };
    /**
     * Entry actions.
     */
    context.cms.onEntryBeforeCreate.subscribe(blockActionOnEvent);

    context.cms.onEntryRevisionBeforeCreate.subscribe(blockActionOnEvent);

    context.cms.onEntryBeforeUpdate.subscribe(blockActionOnEvent);

    context.cms.onEntryBeforeUnpublish.subscribe(blockActionOnEvent);

    context.cms.onEntryBeforePublish.subscribe(blockActionOnEvent);

    context.cms.onEntryBeforeRepublish.subscribe(blockActionOnEvent);

    context.cms.onEntryBeforeRestoreFromBin.subscribe(blockActionOnEvent);

    context.cms.onEntryBeforeMove.subscribe(blockActionOnEvent);
    /**
     * Model actions.
     */
    context.cms.onModelBeforeUpdate.subscribe(blockActionOnEvent);

    context.cms.onModelBeforeCreateFrom.subscribe(blockActionOnEvent);
};
