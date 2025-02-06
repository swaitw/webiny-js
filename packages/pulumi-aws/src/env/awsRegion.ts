import { createGetEnv } from "~/env/base";

export const getEnvVariableAwsRegion = createGetEnv({
    name: "AWS_REGION"
});
