import { SecurityIdentity } from "@webiny/api-security/types";

export const getIdentity = (): Pick<SecurityIdentity, "id" | "displayName" | "type"> => {
    return {
        id: "mocked-identity-id",
        displayName: "mocked-identity-display-name",
        type: "mocked-identity-type"
    };
};
