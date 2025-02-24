import { getApplicationsStacksOutput } from "~/utils/stacks";
import { GracefulError } from "~/utils";
import type { Context, NonEmptyArray } from "~/types";
import { createDeployedSystemFactory, IDeployedSystem } from "./DeployedSystem";
import ora from "ora";

export interface IGetStacksParams {
    env: string;
    primary: string | undefined;
    secondary: string | undefined;
    context: Context;
    folders: NonEmptyArray<string>;
}

export interface IGetStacksResult {
    primary: IDeployedSystem;
    secondary: IDeployedSystem;
}

interface IValidateVariantNamesParams {
    primary: string | undefined;
    secondary: string | undefined;
}

const validateVariantNames = (params: IValidateVariantNamesParams): void => {
    const { primary, secondary } = params;

    /**
     * We cannot check primary/secondary variables with ! because one of them might be empty - systems deployed without a variant.
     * Both cannot be empty.
     *
     * Also, primary and secondary variants cannot be the same.
     */
    if (!primary && !secondary) {
        throw new GracefulError("Primary and secondary variants cannot be empty.");
    } else if (primary === secondary) {
        throw new GracefulError("Primary and secondary variants cannot be the same.");
    }
};

export const getDeployedSystems = async (params: IGetStacksParams): Promise<IGetStacksResult> => {
    const { env, context, folders } = params;
    validateVariantNames(params);

    const message = `Fetching primary and secondary stacks in "${env}" environment...`;
    const spinner = ora(message);

    spinner.start();

    const stacks = await getApplicationsStacksOutput({
        cwd: context.project.root,
        env,
        variants: [params.primary, params.secondary],
        context,
        folders
    });

    const primaryStacks = stacks.filter(stack => stack.variant === params.primary);
    if (primaryStacks.length === 0) {
        spinner.fail(
            `${message} failed. Could not find primary variant${
                params.primary ? ` "${params.primary}"` : ""
            }.`
        );
        throw new GracefulError(
            `Primary variant${params.primary ? ` "${params.primary}"` : ""} not found.`
        );
    }

    const secondaryStacks = stacks.filter(stack => stack.variant === params.secondary);
    if (secondaryStacks.length === 0) {
        spinner.fail(
            `${message} failed. Could not find secondary variant${
                params.secondary ? ` "${params.secondary}"` : ""
            }.`
        );
        throw new GracefulError(
            `Secondary variant${params.secondary ? ` "${params.secondary}"` : ""} not found.`
        );
    }

    spinner.succeed(`${message} done.`);

    const createDeployedSystem = createDeployedSystemFactory({
        folders
    });

    try {
        return {
            primary: createDeployedSystem({
                stacks: primaryStacks
            }),
            secondary: createDeployedSystem({
                stacks: secondaryStacks
            })
        };
    } catch (ex) {
        spinner.fail(ex.message);
        throw ex;
    }
};
