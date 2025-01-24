const { createPulumiCommand } = require("../utils");
const { getStackName } = require("../utils/getStackName");

module.exports = createPulumiCommand({
    name: "pulumi",
    createProjectApplicationWorkspace: false,
    command: async ({ inputs, context, pulumi }) => {
        const [, ...command] = inputs._;
        const { env, variant, folder, debug } = inputs;

        const stackName = getStackName({
            env,
            variant
        });

        if (env) {
            debug && context.debug(`Environment provided - selecting %s Pulumi stack.`, stackName);

            let stackExists = true;
            try {
                const PULUMI_SECRETS_PROVIDER = process.env.PULUMI_SECRETS_PROVIDER;
                const PULUMI_CONFIG_PASSPHRASE = process.env.PULUMI_CONFIG_PASSPHRASE;

                await pulumi.run({
                    command: ["stack", "select", stackName],
                    args: {
                        secretsProvider: PULUMI_SECRETS_PROVIDER
                    },
                    execa: {
                        env: {
                            PULUMI_CONFIG_PASSPHRASE
                        }
                    }
                });
            } catch (e) {
                stackExists = false;
            }

            if (!stackExists) {
                const variantNameMessage = variant ? `, ${context.error.hl(variant)} variant` : "";
                throw new Error(
                    `Project application ${context.error.hl(folder)} (${context.error.hl(
                        env
                    )} environment${variantNameMessage}) does not exist.`
                );
            }
        }

        if (debug) {
            debug &&
                context.debug(
                    `Running the following command in %s folder: %s`,
                    folder,
                    "pulumi " + command.join(" ")
                );
        }

        return pulumi.run({
            command,
            execa: {
                stdio: "inherit",
                env: {
                    WEBINY_ENV: env,
                    WEBINY_ENV_VARIANT: variant || "",
                    WEBINY_PROJECT_NAME: context.project.name
                }
            }
        });
    }
});
