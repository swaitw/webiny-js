import { IUserCommandInput, ProjectApplication, IPulumi } from "~/types";
import { login, getStackName } from "~/utils";

export interface IPulumiLoginSelectStackParams {
    inputs: Pick<IUserCommandInput, "env" | "variant">;
    projectApplication: Pick<ProjectApplication, "paths" | "project">;
    pulumi: Pick<IPulumi, "run">;
}

export const pulumiLoginSelectStack = async ({
    inputs,
    projectApplication,
    pulumi
}: IPulumiLoginSelectStackParams) => {
    const { env, variant } = inputs;

    await login(projectApplication);

    const PULUMI_SECRETS_PROVIDER = process.env.PULUMI_SECRETS_PROVIDER as string;
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
