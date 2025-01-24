const fs = require("fs");
const { green } = require("chalk");
const { getPulumi } = require("@webiny/cli-plugin-deploy-pulumi/utils");
const path = require("path");
const execa = require("execa");

const destroy = ({ stack, env, variant, inputs }) => {
    const command = [
        "webiny",
        "destroy",
        stack,
        "--env",
        env,
        "--debug",
        Boolean(inputs.debug),
        "--build",
        Boolean(inputs.build),
        "--preview",
        Boolean(inputs.preview)
    ];
    if (variant) {
        command.push("--variant", variant);
    }
    return execa("yarn", command, {
        stdio: "inherit"
    });
};

module.exports = async (inputs, context) => {
    const { env, variant = "" } = inputs;

    // Ensure Pulumi is installed.
    const pulumi = await getPulumi({ install: false });

    pulumi.install();

    const hasCore = fs.existsSync(path.join(context.project.root, "apps", "core"));

    console.log();
    context.info(`Destroying ${green("Website")} project application...`);
    await destroy({
        stack: "apps/website",
        env,
        variant,
        inputs
    });

    console.log();
    context.info(`Destroying ${green("Admin")} project application...`);
    await destroy({
        stack: "apps/admin",
        env,
        variant,
        inputs
    });

    console.log();
    context.info(`Destroying ${green("API")} project application...`);
    await destroy({
        stack: "apps/api",
        env,
        variant,
        inputs
    });

    if (hasCore) {
        console.log();
        context.info(`Destroying ${green("Core")} project application...`);
        await destroy({
            stack: "apps/core",
            env,
            variant,
            inputs
        });
    }
};
