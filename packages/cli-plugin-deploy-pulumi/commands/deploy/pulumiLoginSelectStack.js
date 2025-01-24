const { login } = require("../../utils");
const { getStackName } = require("../../utils/getStackName");

module.exports = async ({ inputs, projectApplication, pulumi }) => {
    const { env, variant } = inputs;

    await login(projectApplication);

    const PULUMI_SECRETS_PROVIDER = process.env.PULUMI_SECRETS_PROVIDER;
    const PULUMI_CONFIG_PASSPHRASE = process.env.PULUMI_CONFIG_PASSPHRASE;

    const stackName = getStackName({
        env,
        variant
    });

    await pulumi.run({
        command: ["stack", "select", stackName],
        args: {
            create: true,
            secretsProvider: PULUMI_SECRETS_PROVIDER
        },
        execa: {
            env: {
                PULUMI_CONFIG_PASSPHRASE
            }
        }
    });
};
