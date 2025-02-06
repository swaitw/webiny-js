import fs from "fs";
import { green } from "chalk";
import { getPulumi } from "@webiny/cli-plugin-deploy-pulumi/utils";
import path from "path";
import execa from "execa";
import type { IUserCommandInput } from "@webiny/cli-plugin-deploy-pulumi/types";
import type { CliContext } from "@webiny/cli/types";

const convertToBoolean = (value: unknown): boolean => {
    return value === "true" || value === true;
};

interface IDestroyAppParams {
    stack: string;
    env: string;
    variant: string;
    inputs: IUserCommandInput;
}

const destroyApp = ({ stack, env, variant, inputs }: IDestroyAppParams) => {
    const command: (string | boolean)[] = [
        "webiny",
        "destroy",
        stack,
        "--env",
        env,
        "--debug",
        convertToBoolean(inputs.debug),
        "--build",
        convertToBoolean(inputs.build),
        "--preview",
        convertToBoolean(inputs.preview)
    ];
    if (variant) {
        command.push("--variant", variant);
    }
    return execa("yarn", command as string[], {
        stdio: "inherit"
    });
};

export const destroy = async (inputs: IUserCommandInput, context: CliContext) => {
    const { env, variant = "" } = inputs;

    // This will ensure that the user has Pulumi CLI installed.
    await getPulumi();

    const hasCore = fs.existsSync(path.join(context.project.root, "apps", "core"));

    console.log();
    context.info(`Destroying ${green("Website")} project application...`);
    await destroyApp({
        stack: "apps/website",
        env,
        variant,
        inputs
    });

    console.log();
    context.info(`Destroying ${green("Admin")} project application...`);
    await destroyApp({
        stack: "apps/admin",
        env,
        variant,
        inputs
    });

    console.log();
    context.info(`Destroying ${green("API")} project application...`);
    await destroyApp({
        stack: "apps/api",
        env,
        variant,
        inputs
    });

    if (hasCore) {
        console.log();
        context.info(`Destroying ${green("Core")} project application...`);
        await destroyApp({
            stack: "apps/core",
            env,
            variant,
            inputs
        });
    }
};
