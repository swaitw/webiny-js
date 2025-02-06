import { createConfiguration } from "./configuration";

export interface IWithEnvVariantParams {
    variant: string | undefined;
}

export const withEnvVariant = (params: IWithEnvVariantParams) => {
    return createConfiguration(() => {
        const variant = (params.variant || "").trim();
        if (!variant) {
            return;
        }
        return {
            WEBINY_ENV_VARIANT: variant
        };
    });
};
