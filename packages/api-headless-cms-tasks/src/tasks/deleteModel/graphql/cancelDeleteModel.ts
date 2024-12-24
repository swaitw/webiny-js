import type { HcmsTasksContext } from "~/types";
import type {
    IDeleteCmsModelTask,
    IDeleteModelTaskInput,
    IDeleteModelTaskOutput,
    IStoreValue
} from "~/tasks/deleteModel/types";
import { DELETE_MODEL_TASK } from "~/tasks/deleteModel/constants";
import { WebinyError } from "@webiny/error";
import { getStatus } from "~/tasks/deleteModel/graphql/status";
import { createStoreKey } from "~/tasks/deleteModel/helpers/store";

export interface ICancelDeleteModelParams {
    readonly context: Pick<HcmsTasksContext, "cms" | "tasks" | "db">;
    readonly modelId: string;
}

export const cancelDeleteModel = async (
    params: ICancelDeleteModelParams
): Promise<IDeleteCmsModelTask> => {
    const { context, modelId } = params;

    const model = await context.cms.getModel(modelId);

    await context.cms.accessControl.ensureCanAccessModel({
        model,
        rwd: "d"
    });

    await context.cms.accessControl.ensureCanAccessEntry({
        model,
        rwd: "w"
    });

    const storeKey = createStoreKey(model);

    const result = await context.db.store.getValue<IStoreValue>(storeKey);

    const taskId = result.data?.task;

    await context.db.store.removeValue(storeKey);
    if (!taskId) {
        if (result.error) {
            throw WebinyError.from(result.error, {
                code: "DELETE_MODEL_NO_TASK_DEFINED"
            });
        }
        throw new WebinyError({
            message: `Model "${modelId}" is not being deleted.`,
            code: "MODEL_NOT_BEING_DELETED"
        });
    }

    const task = await context.tasks.getTask<IDeleteModelTaskInput, IDeleteModelTaskOutput>(taskId);
    if (task?.definitionId !== DELETE_MODEL_TASK) {
        throw new WebinyError({
            message: `The task which is deleting a model cannot be found. Please check Step Functions for more info. Task id: ${taskId}`,
            code: "DELETE_MODEL_TASK_NOT_FOUND",
            data: {
                model: model.modelId,
                task: taskId
            }
        });
    }

    const canceledTask = await context.tasks.abort<IDeleteModelTaskInput, IDeleteModelTaskOutput>({
        id: task.id,
        message: "User canceled the task."
    });

    return {
        id: canceledTask.id,
        status: getStatus(canceledTask.taskStatus),
        total: canceledTask.output?.total || 0,
        deleted: canceledTask.output?.deleted || 0
    };
};
