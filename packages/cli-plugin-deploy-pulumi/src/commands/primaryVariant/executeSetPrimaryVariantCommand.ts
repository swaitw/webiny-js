import type { Context, NonEmptyArray } from "~/types";
import { getDeployedSystems } from "./getDeployedSystems";
import { createConnectionSystem } from "./ConnectionSystem";
import type { IExecuteSetPrimaryVariantCommandParams } from "./types";

const folders: NonEmptyArray<string> = ["apps/core", "apps/api"];

export const executeSetPrimaryVariantCommand = async (
    inputs: IExecuteSetPrimaryVariantCommandParams,
    context: Context
): Promise<void> => {
    const { confirm } = inputs;
    const { primary, secondary } = await getDeployedSystems({
        context,
        env: inputs.env,
        primary: inputs.primary,
        secondary: inputs.secondary,
        folders
    });
    /**
     * Let's say we have a connection between primary and secondary systems.
     */
    const connection = createConnectionSystem({
        context,
        primary,
        secondary
    });
    /**
     * We would need to build that connection.
     */
    await connection.build();
    /**
     * And then we can actually deploy it, if confirmed.
     */
    if (!confirm) {
        context.error(
            `Setting primary variant${
                inputs.primary ? ` "${inputs.primary}"` : ""
            } is not confirmed. Please add "--confirm" argument to your command to actually deploy changes.`
        );
        return;
    }

    await connection.deploy();

    console.log(
        JSON.stringify({
            primary,
            secondary
        })
    );
};
