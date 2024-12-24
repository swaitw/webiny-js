import { CmsErrorResponse, CmsModel } from "~/types";
import { IDeleteCmsModelTask } from "~/admin/viewsGraphql";

export enum FullyDeleteModelStateStatus {
    NONE = 0,
    UNDERSTOOD = 1,
    CONFIRMED = 2,
    PROCESSED = 3,
    ERROR = 999
}

export interface IFullyDeleteModelState {
    status: FullyDeleteModelStateStatus;
    confirmation: string;
    model: CmsModel | null;
    error: CmsErrorResponse | null;
    task: IDeleteCmsModelTask | null;
}
