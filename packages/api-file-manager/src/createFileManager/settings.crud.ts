import { createTopic } from "@webiny/pubsub";
import { FileManagerSettings, SettingsCRUD } from "~/types";
import { FileManagerConfig } from "~/createFileManager/index";
import zod from "zod";
import { createZodError } from "@webiny/utils";

const MIN_FILE_SIZE = 0;
const MAX_FILE_SIZE = 10737418240;

const uploadMinFileSizeValidation = zod
    .number()
    .min(MIN_FILE_SIZE, {
        message: `Value needs to be greater than or equal to ${MIN_FILE_SIZE}.`
    })
    .optional();
const uploadMaxFileSizeValidation = zod
    .number()
    .max(MAX_FILE_SIZE, {
        message: `Value needs to be lesser than or equal to ${MAX_FILE_SIZE}.`
    })
    .optional();

const createDataModelValidation = zod.object({
    uploadMinFileSize: uploadMinFileSizeValidation.default(MIN_FILE_SIZE),
    uploadMaxFileSize: uploadMaxFileSizeValidation.default(MAX_FILE_SIZE),
    srcPrefix: zod
        .string()
        .optional()
        .default("/files/")
        .transform(value => {
            if (typeof value === "string") {
                return value.endsWith("/") ? value : value + "/";
            }
            return value;
        })
});

const updateDataModelValidation = zod.object({
    uploadMinFileSize: uploadMinFileSizeValidation,
    uploadMaxFileSize: uploadMaxFileSizeValidation,
    srcPrefix: zod
        .string()
        .optional()
        .transform(value => {
            if (typeof value === "string") {
                return value.endsWith("/") ? value : value + "/";
            }
            return value;
        })
});

export const createSettingsCrud = ({
    storageOperations,
    getTenantId
}: FileManagerConfig): SettingsCRUD => {
    return {
        onSettingsBeforeUpdate: createTopic("fileManager.onSettingsBeforeUpdate"),
        onSettingsAfterUpdate: createTopic("fileManager.onSettingsAfterUpdate"),
        async getSettings() {
            return storageOperations.settings.get({ tenant: getTenantId() });
        },
        async createSettings(data) {
            const results = createDataModelValidation.safeParse(data);
            if (!results.success) {
                throw createZodError(results.error);
            }

            return storageOperations.settings.create({
                data: {
                    ...results.data,
                    tenant: getTenantId()
                }
            });
        },
        async updateSettings(data) {
            const results = updateDataModelValidation.safeParse(data);
            if (!results.success) {
                throw createZodError(results.error);
            }

            const original = (await storageOperations.settings.get({
                tenant: getTenantId()
            })) as FileManagerSettings;
            const newSettings: FileManagerSettings = {
                ...(original || {})
            };

            for (const key in results.data) {
                // @ts-expect-error
                const value = results.data[key];
                if (value === undefined) {
                    continue;
                }
                // @ts-expect-error
                newSettings[key] = value;
            }

            const settings: FileManagerSettings = {
                ...newSettings,
                tenant: getTenantId()
            };

            await this.onSettingsBeforeUpdate.publish({
                input: data,
                original,
                settings
            });
            const result = await storageOperations.settings.update({
                original,
                data: settings
            });
            await this.onSettingsAfterUpdate.publish({
                input: data,
                original,
                settings: result
            });

            return result;
        },
        async deleteSettings() {
            await storageOperations.settings.delete({ tenant: getTenantId() });

            return true;
        }
    };
};
