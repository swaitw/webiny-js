const { createPulumiCommand, processHooks } = require("../utils");
const { getStackName } = require("../utils/getStackName");

module.exports = createPulumiCommand({
    name: "destroy",
    // We want to create a workspace just because there are cases where the destroy command is called
    // without the deployment happening initially (e.g. CI/CD scaffold's `pullRequestClosed.yml` workflow).
    createProjectApplicationWorkspace: true,
    command: async ({ inputs, context, projectApplication, pulumi, getDuration }) => {
        const { env, variant, folder } = inputs;

        const stackName = getStackName({
            env,
            variant
        });

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
            const variantNameMessage = variant ? `, %s variant` : "";
            context.error(
                `Project application %s (%s environment${variantNameMessage}) does not exist.`,
                folder,
                env,
                variant
            );
            return;
        }

        const hooksParams = { context, env, variant, projectApplication };

        await processHooks("hook-before-destroy", hooksParams);

        await pulumi.run({
            command: "destroy",
            args: {
                debug: inputs.debug,
                yes: true
            },
            execa: {
                stdio: "inherit",
                env: {
                    WEBINY_ENV: env,
                    WEBINY_ENV_VARIANT: variant || "",
                    WEBINY_PROJECT_NAME: context.project.name
                }
            }
        });

        console.log();

        context.success(`Done! Destroy finished in %s.`, getDuration());

        await processHooks("hook-after-destroy", hooksParams);
    }
});
