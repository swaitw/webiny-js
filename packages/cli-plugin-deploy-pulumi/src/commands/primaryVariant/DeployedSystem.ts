import type { IStackOutput } from "~/utils";
import { GracefulError } from "~/utils";
import type { IStack } from "~/utils/stacks/Stack";

export interface IDeployedSystem {
    readonly env: string;
    readonly variant: string | undefined;
    readonly stacks: IStack<IStackOutput>[];
    getStack<T extends IStackOutput = IStackOutput>(app: string): Required<IStack<T>>;
}

export interface IDeployedSystemParams {
    env: string;
    variant: string | undefined;
    stacks: Required<IStack<IStackOutput>>[];
}

export class DeployedSystem implements IDeployedSystem {
    public readonly env: string;
    public readonly variant: string | undefined;
    public readonly stacks: IStack<IStackOutput>[];

    public constructor(params: IDeployedSystemParams) {
        this.env = params.env;
        this.variant = params.variant;
        this.stacks = params.stacks;
    }

    public getStack<T extends IStackOutput = IStackOutput>(app: string): Required<IStack<T>> {
        const stack = this.stacks.find(stack => stack.app === app);
        if (!stack) {
            throw new GracefulError(`Stack for application "${app}" not found.`);
        }
        return stack as Required<IStack<T>>;
    }
}

export interface ICreateDeployedSystemFactoryParams {
    folders: string[];
}

export interface ICreateDeployedSystem {
    (params: Pick<IDeployedSystemParams, "stacks">): IDeployedSystem;
}

export interface ICreateDeployedSystemFactory {
    (params: ICreateDeployedSystemFactoryParams): ICreateDeployedSystem;
}

export const createDeployedSystemFactory: ICreateDeployedSystemFactory = ({ folders }) => {
    return params => {
        if (!params.stacks.length) {
            throw new GracefulError(`No stacks found for the system.`);
        }
        const { env, variant } = params.stacks[0];

        for (const folder of folders) {
            const exists = params.stacks.some(stack => stack.folder === folder);
            if (!exists) {
                throw new GracefulError(
                    `Stack for application "${folder}" is missing in system env "${env}", variant "${
                        variant || ""
                    }".`
                );
            }
        }
        return new DeployedSystem({
            ...params,
            env,
            variant
        });
    };
};
