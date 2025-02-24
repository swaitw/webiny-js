import { getStackOutput, GracefulError } from "@webiny/cli-plugin-deploy-pulumi/utils";
import { BeforeDeployPlugin } from "@webiny/cli-plugin-deploy-pulumi/plugins";

export const ensureCoreDeployed = new BeforeDeployPlugin(({ env, variant }, ctx) => {
    const output = getStackOutput({
        folder: "apps/core",
        env,
        variant
    });
    const coreDeployed = output && Object.keys(output).length > 0;
    if (coreDeployed) {
        return;
    }
    let variantCmd = "";
    if (variant) {
        variantCmd = ` --variant ${variant}`;
    }

    const coreAppName = ctx.error.hl("Core");
    const apiAppName = ctx.error.hl("API");
    const cmd = ctx.error.hl(`yarn webiny deploy core --env ${env}${variantCmd}`);
    ctx.error(`Cannot deploy ${apiAppName} project application before deploying ${coreAppName}.`);

    throw new GracefulError(
        [
            `Before deploying ${apiAppName} project application, please`,
            `deploy ${coreAppName} first by running: ${cmd}.`
        ].join(" ")
    );
});

ensureCoreDeployed.name = "api.before-deploy.ensure-core-deployed";
