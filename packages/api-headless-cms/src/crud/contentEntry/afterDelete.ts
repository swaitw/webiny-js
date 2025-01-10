/**
 * TODO: possibly remove this subscription.
 * It creates problems when doing mass deletes on DDB only systems with a lot of entries.
 */
import { Topic } from "@webiny/pubsub/types";
import { CmsContext, OnEntryAfterDeleteTopicParams } from "~/types";
import { markUnlockedFields } from "./markLockedFields";

interface AssignAfterEntryDeleteParams {
    context: CmsContext;
    onEntryAfterDelete: Topic<OnEntryAfterDeleteTopicParams>;
}
export const assignAfterEntryDelete = (params: AssignAfterEntryDeleteParams) => {
    const { context, onEntryAfterDelete } = params;

    onEntryAfterDelete.subscribe(async params => {
        const { entry, model, permanent } = params;
        if (model.isPlugin) {
            return;
        }

        // If the entry is being moved to the trash, we keep the model fields locked because the entry can be restored.
        if (!permanent || !model.isPlugin) {
            return;
        }
        const { items } = await context.cms.storageOperations.entries.list(model, {
            where: {
                entryId_not: entry.entryId,
                latest: true
            },
            limit: 1
        });
        if (items.length > 0) {
            return;
        }
        await markUnlockedFields({
            context,
            model
        });
    });
};
