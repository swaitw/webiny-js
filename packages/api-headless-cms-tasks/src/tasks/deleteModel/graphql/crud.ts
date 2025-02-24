import type { HcmsTasksContext } from "~/types";
import { fullyDeleteModel as fullyDeleteModelMethod } from "./fullyDeleteModel";
import { cancelDeleteModel } from "./cancelDeleteModel";
import { getDeleteModelProgress as getDeleteModelProgressMethod } from "./getDeleteModelProgress";
import { createCacheKey, createMemoryCache } from "@webiny/api-headless-cms/utils";
import type { IStoreValue, ListStoreKeysResult } from "../types";
import { createStoreNamespace } from "~/tasks/deleteModel/helpers/store";
import type { GenericRecord } from "@webiny/api/types";
import { ContextPlugin } from "@webiny/api";
import { attachLifecycleEvents } from "./attachLifecycleEvents";

export const createDeleteModelCrud = () => {
    const plugin = new ContextPlugin<HcmsTasksContext>(async context => {
        attachLifecycleEvents({
            context
        });
        const getLocale = (): string => {
            return context.cms.getLocale().code;
        };
        const getTenant = (): string => {
            return context.tenancy.getCurrentTenant().id;
        };

        const cache = createMemoryCache<ListStoreKeysResult>();

        context.cms.listModelsBeingDeleted = async () => {
            const locale = getLocale();
            const tenant = getTenant();
            const cacheKey = createCacheKey({
                tenant: getTenant(),
                locale: getLocale(),
                type: "deleteModel"
            });

            const result = await cache.getOrSet(cacheKey, async () => {
                const beginsWith = createStoreNamespace({
                    tenant,
                    locale
                });
                return await context.db.store.listValues<GenericRecord<string, IStoreValue>>({
                    beginsWith
                });
            });

            if (result.error) {
                throw result.error;
            } else if (!result.data) {
                return [];
            }
            return Object.values(result.data);
        };

        context.cms.isModelBeingDeleted = async (modelId: string) => {
            const items = await context.cms.listModelsBeingDeleted();
            return items.some(item => item.modelId === modelId);
        };
        context.cms.fullyDeleteModel = async (modelId: string) => {
            const result = await fullyDeleteModelMethod({
                context,
                modelId
            });
            cache.clear();
            return result;
        };

        context.cms.cancelFullyDeleteModel = async (modelId: string) => {
            const result = await cancelDeleteModel({
                context,
                modelId
            });
            cache.clear();
            return result;
        };

        context.cms.getDeleteModelProgress = async (modelId: string) => {
            return await getDeleteModelProgressMethod({
                context,
                modelId
            });
        };
    });

    plugin.name = "headlessCms.context.cms.fullyDeleteModel";

    return plugin;
};
