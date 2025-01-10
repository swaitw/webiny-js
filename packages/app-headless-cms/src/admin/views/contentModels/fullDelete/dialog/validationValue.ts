import type { CmsModel } from "~/types";

export const createValidationValue = (params: Pick<CmsModel, "modelId">) => {
    return `delete ${params.modelId}`;
};
