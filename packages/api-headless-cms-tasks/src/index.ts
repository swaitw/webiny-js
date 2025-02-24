import {
    createBulkActionEntriesTasks,
    createEmptyTrashBinsTask,
    createHcmsBulkActions
} from "@webiny/api-headless-cms-bulk-actions";
import { createHeadlessCmsImportExport } from "@webiny/api-headless-cms-import-export";
import { createDeleteModelTask } from "~/tasks/deleteModel";

export { createDeleteModelTask };

export const createHcmsTasks = () => [
    createHcmsBulkActions(),
    createBulkActionEntriesTasks(),
    createEmptyTrashBinsTask(),
    createHeadlessCmsImportExport(),
    createDeleteModelTask()
];
