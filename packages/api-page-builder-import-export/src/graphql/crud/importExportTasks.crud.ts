import zod from "zod";
import { createZodError, mdbid } from "@webiny/utils";
import { ContextPlugin } from "@webiny/api";
import { NotFoundError } from "@webiny/handler-graphql";
import {
    ImportExportPluginsParams,
    ImportExportTask,
    ImportExportTaskStatus,
    ImportExportTaskStorageOperationsListSubTaskParams
} from "~/types";
import { PbImportExportContext } from "~/graphql/types";
import WebinyError from "@webiny/error";
import { PageElementStorageOperationsListParams } from "@webiny/api-page-builder/types";
import { PagesPermissions } from "@webiny/api-page-builder/graphql/crud/permissions/PagesPermissions";

const dataModelStats = zod
    .object({
        [ImportExportTaskStatus.PENDING]: zod.number().optional().default(0),
        [ImportExportTaskStatus.PROCESSING]: zod.number().optional().default(0),
        [ImportExportTaskStatus.COMPLETED]: zod.number().optional().default(0),
        [ImportExportTaskStatus.FAILED]: zod.number().optional().default(0),
        total: zod.number().optional().default(0)
    })
    .optional()
    .default({
        [ImportExportTaskStatus.PENDING]: 0,
        [ImportExportTaskStatus.PROCESSING]: 0,
        [ImportExportTaskStatus.COMPLETED]: 0,
        [ImportExportTaskStatus.FAILED]: 0,
        total: 0
    });

const CreateDataModel = zod.object({
    status: zod.enum([
        ImportExportTaskStatus.PENDING,
        ImportExportTaskStatus.PROCESSING,
        ImportExportTaskStatus.COMPLETED,
        ImportExportTaskStatus.FAILED
    ]),
    data: zod.object({}).passthrough().default({}),
    input: zod.object({}).passthrough().default({}),
    error: zod.object({}).passthrough().default({}),
    stats: dataModelStats
});

const UpdateDataModel = zod.object({
    status: zod
        .enum([
            ImportExportTaskStatus.PENDING,
            ImportExportTaskStatus.PROCESSING,
            ImportExportTaskStatus.COMPLETED,
            ImportExportTaskStatus.FAILED
        ])
        .optional(),
    data: zod.object({}).passthrough().default({}),
    input: zod.object({}).passthrough().default({}),
    error: zod.object({}).passthrough().default({}),
    stats: dataModelStats
});

export default ({ storageOperations }: ImportExportPluginsParams) =>
    new ContextPlugin<PbImportExportContext>(async context => {
        /**
         * If pageBuilder is not defined on the context, do not continue, but log it.
         */
        if (!context.pageBuilder) {
            console.log("Missing pageBuilder on context. Skipping  ImportExportTasks crud.");
            return;
        }

        const pagesPermissions = new PagesPermissions({
            getPermissions: () => context.security.getPermissions("pb.page"),
            getIdentity: context.security.getIdentity,
            fullAccessPermissionName: "pb.*"
        });

        const getLocale = () => {
            const locale = context.i18n.getContentLocale();
            if (!locale) {
                throw new WebinyError(
                    "Missing content locale in importExportTasks.crud.ts",
                    "LOCALE_ERROR"
                );
            }
            return locale;
        };

        // Modify context
        context.pageBuilder.importExportTask = {
            storageOperations,
            async getTask(id) {
                await pagesPermissions.ensure({ rwd: "r" });

                const tenant = context.tenancy.getCurrentTenant();
                const locale = getLocale();

                const params = {
                    where: {
                        tenant: tenant.id,
                        locale: locale.code,
                        id
                    }
                };

                let importExportTask: ImportExportTask | null = null;

                try {
                    importExportTask = await storageOperations.getTask(params);

                    if (!importExportTask) {
                        return null;
                    }
                } catch (ex) {
                    throw new WebinyError(
                        ex.message || "Could not get importExportTask by id.",
                        ex.code || "GET_IMPORT_EXPORT_TASK_ERROR",
                        {
                            ...(ex.data || {}),
                            params
                        }
                    );
                }

                await pagesPermissions.ensure({ owns: importExportTask.createdBy });

                return importExportTask;
            },

            async listTasks(params) {
                await pagesPermissions.ensure({ rwd: "r" });

                const tenant = context.tenancy.getCurrentTenant();
                const locale = getLocale();

                const { sort, limit } = params || {};

                const listParams: PageElementStorageOperationsListParams = {
                    where: {
                        tenant: tenant.id,
                        locale: locale.code
                    },
                    sort: Array.isArray(sort) && sort.length > 0 ? sort : ["createdOn_ASC"],
                    limit: limit
                };

                // If user can only manage own records, let's add that to the listing.
                if (await pagesPermissions.canAccessOnlyOwnRecords) {
                    const identity = context.security.getIdentity();
                    listParams.where.createdBy = identity.id;
                }

                try {
                    const [items] = await storageOperations.listTasks(listParams);
                    return items;
                } catch (ex) {
                    throw new WebinyError(
                        ex.message || "Could not list all importExportTask.",
                        ex.code || "LIST_ELEMENTS_ERROR",
                        {
                            params
                        }
                    );
                }
            },

            async createTask(input) {
                await pagesPermissions.ensure({ rwd: "w" });

                const validation = CreateDataModel.safeParse(input);
                if (!validation.success) {
                    throw createZodError(validation.error);
                }

                const id: string = mdbid();
                const identity = context.security.getIdentity();

                const importExportTask: ImportExportTask = {
                    ...validation.data,
                    parent: "",
                    tenant: context.tenancy.getCurrentTenant().id,
                    locale: getLocale().code,
                    id,
                    createdOn: new Date().toISOString(),
                    createdBy: {
                        id: identity.id,
                        type: identity.type,
                        displayName: identity.displayName
                    }
                };

                try {
                    return await storageOperations.createTask({
                        input: validation.data,
                        task: importExportTask
                    });
                } catch (ex) {
                    throw new WebinyError(
                        ex.message || "Could not create importExportTask.",
                        ex.code || "CREATE_IMPORT_EXPORT_TASK_ERROR",
                        {
                            ...(ex.data || {}),
                            importExportTask
                        }
                    );
                }
            },

            async updateTask(id, input) {
                await pagesPermissions.ensure({ rwd: "w" });

                const original = await context.pageBuilder.importExportTask.getTask(id);
                if (!original) {
                    throw new NotFoundError(`ImportExportTask "${id}" not found.`);
                }

                await pagesPermissions.ensure({ owns: original.createdBy });

                const validation = UpdateDataModel.safeParse(input);
                if (!validation.success) {
                    throw createZodError(validation.error);
                }

                const importExportTask = {
                    ...original
                };

                for (const key in validation.data) {
                    // @ts-expect-error
                    const value = validation.data[key];
                    if (value === undefined) {
                        continue;
                    }
                    // @ts-expect-error
                    importExportTask[key] = value;
                }

                try {
                    return await storageOperations.updateTask({
                        input: validation.data,
                        original,
                        task: importExportTask
                    });
                } catch (ex) {
                    throw new WebinyError(
                        ex.message || "Could not update importExportTask.",
                        ex.code || "UPDATE_IMPORT_EXPORT_TASK_ERROR",
                        {
                            ...(ex.data || {}),
                            original,
                            importExportTask
                        }
                    );
                }
            },

            async deleteTask(id) {
                await pagesPermissions.ensure({ rwd: "d" });

                const importExportTask = await context.pageBuilder.importExportTask.getTask(id);
                if (!importExportTask) {
                    throw new NotFoundError(`ImportExportTask "${id}" not found.`);
                }

                await pagesPermissions.ensure({ owns: importExportTask.createdBy });

                try {
                    return await storageOperations.deleteTask({
                        task: importExportTask
                    });
                } catch (ex) {
                    throw new WebinyError(
                        ex.message || "Could not delete importExportTask.",
                        ex.code || "DELETE_IMPORT_EXPORT_TASK_ERROR",
                        {
                            ...(ex.data || {}),
                            importExportTask
                        }
                    );
                }
            },

            async updateStats(id, input) {
                await pagesPermissions.ensure({ rwd: "w" });

                const original = await context.pageBuilder.importExportTask.getTask(id);
                if (!original) {
                    throw new NotFoundError(`ImportExportTask "${id}" not found.`);
                }

                await pagesPermissions.ensure({ owns: original.createdBy });

                try {
                    return await storageOperations.updateTaskStats({
                        input,
                        original
                    });
                } catch (ex) {
                    throw new WebinyError(
                        ex.message || "Could not update importExportTask.",
                        ex.code || "UPDATE_IMPORT_EXPORT_TASK_ERROR",
                        {
                            ...(ex.data || {}),
                            original
                        }
                    );
                }
            },

            async createSubTask(parent, id, input) {
                await pagesPermissions.ensure({ rwd: "w" });

                const validation = CreateDataModel.safeParse(input);
                if (!validation.success) {
                    throw createZodError(validation.error);
                }

                const identity = context.security.getIdentity();

                const importExportSubTask: ImportExportTask = {
                    ...validation.data,
                    tenant: context.tenancy.getCurrentTenant().id,
                    locale: getLocale().code,
                    id,
                    parent,
                    createdOn: new Date().toISOString(),
                    createdBy: {
                        id: identity.id,
                        type: identity.type,
                        displayName: identity.displayName
                    }
                };

                try {
                    return await storageOperations.createSubTask({
                        input: validation.data,
                        subTask: importExportSubTask
                    });
                } catch (ex) {
                    throw new WebinyError(
                        ex.message || "Could not create importExportSubTask.",
                        ex.code || "CREATE_IMPORT_EXPORT_TASK_ERROR",
                        {
                            ...(ex.data || {}),
                            importExportSubTask
                        }
                    );
                }
            },

            async updateSubTask(parent, subTaskId, input) {
                await pagesPermissions.ensure({ rwd: "w" });

                const original = await context.pageBuilder.importExportTask.getSubTask(
                    parent,
                    subTaskId
                );
                if (!original) {
                    throw new NotFoundError(
                        `ImportExportTask parent: "${parent}" and id: "${subTaskId}" not found.`
                    );
                }

                await pagesPermissions.ensure({ owns: original.createdBy });

                const validation = UpdateDataModel.safeParse(input);
                if (!validation.success) {
                    throw createZodError(validation.error);
                }

                const importExportSubTask = {
                    ...original
                };
                for (const key in validation.data) {
                    // @ts-expect-error
                    const value = validation.data[key];
                    if (value === undefined) {
                        continue;
                    }
                    // @ts-expect-error
                    importExportSubTask[key] = value;
                }

                try {
                    return await storageOperations.updateSubTask({
                        input: validation.data,
                        original,
                        subTask: importExportSubTask
                    });
                } catch (ex) {
                    throw new WebinyError(
                        ex.message || "Could not update importExportSubTask.",
                        ex.code || "UPDATE_IMPORT_EXPORT_TASK_ERROR",
                        {
                            ...(ex.data || {}),
                            importExportSubTask,
                            original
                        }
                    );
                }
            },

            async getSubTask(parent, subTaskId) {
                await pagesPermissions.ensure({ rwd: "r" });

                const tenant = context.tenancy.getCurrentTenant();
                const locale = getLocale();

                const params = {
                    where: {
                        tenant: tenant.id,
                        locale: locale.code,
                        id: subTaskId,
                        parent: parent
                    }
                };

                let importExportSubTask: ImportExportTask | null = null;

                try {
                    importExportSubTask = await storageOperations.getSubTask(params);
                    if (!importExportSubTask) {
                        return null;
                    }
                } catch (ex) {
                    throw new WebinyError(
                        ex.message || "Could not get importExportSubTask by id.",
                        ex.code || "GET_IMPORT_EXPORT_TASK_ERROR",
                        {
                            ...(ex.data || {}),
                            params
                        }
                    );
                }

                await pagesPermissions.ensure({ owns: importExportSubTask.createdBy });

                return importExportSubTask;
            },

            async listSubTasks(parent, status, limit) {
                await pagesPermissions.ensure({ rwd: "r" });

                const tenant = context.tenancy.getCurrentTenant();
                const locale = getLocale();

                const listParams: ImportExportTaskStorageOperationsListSubTaskParams = {
                    where: {
                        tenant: tenant.id,
                        locale: locale.code,
                        parent: parent,
                        status
                    },
                    limit
                };

                // If user can only manage own records, let's add that to the listing.
                if (await pagesPermissions.canAccessOnlyOwnRecords()) {
                    const identity = context.security.getIdentity();
                    listParams.where.createdBy = identity.id;
                }

                try {
                    const [items] = await storageOperations.listSubTasks(listParams);
                    return items;
                } catch (ex) {
                    throw new WebinyError(
                        ex.message || "Could not list all importExportSubTask.",
                        ex.code || "LIST_IMPORT_EXPORT_TASK_ERROR",
                        {
                            params: {
                                parent,
                                status,
                                limit
                            }
                        }
                    );
                }
            }
        };
    });
