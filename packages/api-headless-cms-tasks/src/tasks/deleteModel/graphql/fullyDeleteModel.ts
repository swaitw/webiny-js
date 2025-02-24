import type { HcmsTasksContext } from "~/types";
import { DELETE_MODEL_TASK } from "~/tasks/deleteModel/constants";
import type {
    IDeleteCmsModelTask,
    IDeleteModelTaskInput,
    IStoreValue
} from "~/tasks/deleteModel/types";
import { getStatus } from "~/tasks/deleteModel/graphql/status";
import { createStoreKey, createStoreValue } from "~/tasks/deleteModel/helpers/store";

export interface IFullyDeleteModelParams {
    readonly context: Pick<HcmsTasksContext, "cms" | "tasks" | "db" | "security">;
    readonly modelId: string;
}

export const fullyDeleteModel = async (
    params: IFullyDeleteModelParams
): Promise<IDeleteCmsModelTask> => {
    const { context, modelId } = params;

    const model = await context.cms.getModel(modelId);

    if (model.isPrivate) {
        throw new Error(`Cannot delete private model.`);
    }

    await context.cms.accessControl.ensureCanAccessModel({
        model,
        rwd: "d"
    });

    await context.cms.accessControl.ensureCanAccessEntry({
        model,
        rwd: "w"
    });

    if (!model) {
        throw new Error(`Model "${modelId}" not found.`);
    }
    const storeKey = createStoreKey(model);
    const result = await context.db.store.getValue<IStoreValue>(storeKey);
    const taskId = result.data?.task;
    if (taskId) {
        throw new Error(`Model "${modelId}" is already getting deleted. Task id: ${taskId}.`);
    }

    const task = await context.tasks.trigger<IDeleteModelTaskInput>({
        input: {
            modelId
        },
        definition: DELETE_MODEL_TASK,
        name: `Fully delete model: ${modelId}`
    });

    await context.db.store.storeValue(
        storeKey,
        createStoreValue({
            ...model,
            identity: context.security.getIdentity(),
            task: task.id
        })
    );

    return {
        id: task.id,
        status: getStatus(task.taskStatus),
        total: 0,
        deleted: 0
    };
};
