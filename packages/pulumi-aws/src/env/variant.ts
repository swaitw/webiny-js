import { createGetEnvOptional } from "~/env/base";

export const getEnvVariableWebinyVariant = createGetEnvOptional<string>({
    name: "WEBINY_ENV_VARIANT",
    defaultValue: ""
});
