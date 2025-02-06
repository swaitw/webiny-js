import { createConfiguration } from "./configuration";

export const withPulumiConfigPassphrase = () => {
    return createConfiguration(() => {
        return {
            PULUMI_CONFIG_PASSPHRASE: process.env.PULUMI_CONFIG_PASSPHRASE
        };
    });
};
