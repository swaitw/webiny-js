import { createTaskDefinition } from "@webiny/tasks";
import { createDeleteEntry, createListDeletedEntries } from "~/useCases";
import {
    HcmsBulkActionsContext,
    IEmptyTrashBinsInput,
    IEmptyTrashBinsOutput,
    IEmptyTrashBinsTaskParams
} from "~/types";

const calculateDateTimeString = () => {
    // Retrieve the retention period from the environment variable WEBINY_TRASH_BIN_RETENTION_PERIOD_DAYS,
    // or default to 90 days if not set or set to 0.
    const retentionPeriodFromEnv = process.env["WEBINY_TRASH_BIN_RETENTION_PERIOD_DAYS"];
    const retentionPeriod =
        retentionPeriodFromEnv && Number(retentionPeriodFromEnv) !== 0
            ? Number(retentionPeriodFromEnv)
            : 90;

    // Calculate the date-time by subtracting the retention period (in days) from the current date.
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - retentionPeriod);

    // Return the calculated date-time string in ISO 8601 format.
    return currentDate.toISOString();
};

export const createEmptyTrashBinsTask = () => {
    return createTaskDefinition<
        HcmsBulkActionsContext,
        IEmptyTrashBinsInput,
        IEmptyTrashBinsOutput
    >({
        isPrivate: true,
        id: "hcmsEntriesEmptyTrashBins",
        title: "Headless CMS - Empty all trash bins",
        description: "Delete all entries in the trash bin for each model in the system.",
        maxIterations: 120,
        disableDatabaseLogs: true,
        run: async (params: IEmptyTrashBinsTaskParams) => {
            const { response, isAborted, context, input, isCloseToTimeout } = params;

            // Abort the task if needed.
            if (isAborted()) {
                return response.aborted();
            }

            // Fetch all tenants, excluding those already processed.
            const baseTenants = await context.tenancy.listTenants();
            const executedTenantIds = input.executedTenantIds || [];
            const tenants = baseTenants.filter(tenant => !executedTenantIds.includes(tenant.id));
            let shouldContinue = false; // Flag to check if task should continue.

            // Iterate over each tenant.
            await context.tenancy.withEachTenant(tenants, async tenant => {
                if (isCloseToTimeout()) {
                    shouldContinue = true;
                    return;
                }

                // Fetch all locales for the tenant.
                const locales = context.i18n.getLocales();
                await context.i18n.withEachLocale(locales, async () => {
                    if (isCloseToTimeout()) {
                        shouldContinue = true;
                        return;
                    }

                    // List all non-private models for the current locale.
                    const models = await context.security.withoutAuthorization(async () =>
                        (await context.cms.listModels()).filter(m => !m.isPrivate)
                    );

                    // Process each model to delete trashed entries.
                    for (const model of models) {
                        const list = createListDeletedEntries(context); // List trashed entries.
                        const mutation = createDeleteEntry(context); // Mutation to delete entries.

                        // Query parameters for fetching deleted entries older than a minute ago.
                        const listEntriesParams = {
                            where: { deletedOn_lt: calculateDateTimeString() },
                            limit: 50
                        };

                        let result;
                        // Continue deleting entries while there are entries left to delete.
                        while (
                            (result = await list.execute(model.modelId, listEntriesParams)) &&
                            result.meta.totalCount > 0
                        ) {
                            if (isCloseToTimeout()) {
                                shouldContinue = true;
                                break;
                            }
                            for (const entry of result.entries) {
                                if (isCloseToTimeout()) {
                                    shouldContinue = true;
                                    break;
                                }
                                // Delete each entry individually.
                                await mutation.execute(model, entry.id);
                            }
                        }
                    }
                });

                // If the task isn't continuing, add the tenant to the executed list.
                if (!shouldContinue) {
                    executedTenantIds.push(tenant.id);
                }
            });

            // Continue the task or mark it as done based on the `shouldContinue` flag.
            return shouldContinue
                ? response.continue({ ...input, executedTenantIds })
                : response.done("Task done: emptied the trash bin for all registered models.");
        }
    });
};
