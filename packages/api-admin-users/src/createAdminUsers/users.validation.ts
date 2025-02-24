import zod from "zod";
import { AdminUsers } from "~/types";
import { createZodError } from "@webiny/utils";

const createUserDataValidation = zod.object({
    id: zod.string().min(1).optional(),
    displayName: zod.string().min(1).optional(),
    // We did not use an e-mail validator here, just because external
    // IdPs (Okta, Auth0) do not require e-mail to be present. When creating
    // admin users, they're actually passing the user's ID as the e-mail.
    // For example: packages/api-security-okta/src/createAdminUsersHooks.ts:13
    // In the future, we might want to rename this field to `idpId` or similar.
    email: zod.string(),
    firstName: zod.string().min(1).optional(),
    lastName: zod.string().min(1).optional(),
    avatar: zod.object({}).passthrough().optional()
});

const updateUserDataValidation = zod.object({
    displayName: zod.string().min(1).optional(),
    avatar: zod.object({}).passthrough().optional().nullable(),
    firstName: zod.string().min(1).optional(),
    lastName: zod.string().min(1).optional(),
    group: zod.string().optional(),
    team: zod.string().optional()
});

export const attachUserValidation = (
    params: Pick<AdminUsers, "onUserBeforeCreate" | "onUserBeforeUpdate">
) => {
    const { onUserBeforeCreate, onUserBeforeUpdate } = params;
    onUserBeforeCreate.subscribe(async ({ inputData }) => {
        const validation = createUserDataValidation.safeParse(inputData);
        if (validation.success) {
            return;
        }
        console.log(JSON.stringify(validation.error, null, 2));
        throw createZodError(validation.error);
    });

    onUserBeforeUpdate.subscribe(async ({ inputData }) => {
        const validation = updateUserDataValidation.safeParse(inputData);
        if (validation.success) {
            return;
        }
        throw createZodError(validation.error);
    });
};
