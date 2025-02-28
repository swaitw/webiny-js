import { AfterModelUpdateTopicParams, CmsContext } from "~/types";
import { Topic } from "@webiny/pubsub/types";

export interface Params {
    onAfterUpdate: Topic<AfterModelUpdateTopicParams>;
    context: CmsContext;
}
export const assignAfterModelUpdate = (params: Params) => {
    const { onAfterUpdate, context } = params;

    onAfterUpdate.subscribe(async () => {
        await context.cms.updateModelLastChange();
    });
};
