import { getStackOutput } from "./getStackOutput";

export interface IGetDeploymentId {
    env: string | undefined;
    variant: string | undefined;
}

export const getDeploymentId = (params: IGetDeploymentId) => {
    if (!params.env) {
        throw new Error(`Please specify environment, for example "dev".`);
    }

    const coreStackOutput = getStackOutput({
        folder: "core",
        env: params.env,
        variant: params.variant
    });

    return coreStackOutput.deploymentId;
};
