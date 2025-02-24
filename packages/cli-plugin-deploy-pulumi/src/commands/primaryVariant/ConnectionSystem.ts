import ora from "ora";
import type { IDeployedSystem } from "./DeployedSystem";
import type { Context } from "~/types";

export interface IConnectionSystem {
    readonly context: Context;
    readonly primary: IDeployedSystem;
    readonly secondary: IDeployedSystem;

    build(): Promise<void>;
    deploy(): Promise<void>;
}

export interface IConnectionSystemParams {
    context: Context;
    primary: IDeployedSystem;
    secondary: IDeployedSystem;
}

export class ConnectionSystem implements IConnectionSystem {
    public readonly context: Context;
    public readonly primary: IDeployedSystem;
    public readonly secondary: IDeployedSystem;

    public constructor(params: IConnectionSystemParams) {
        this.context = params.context;
        this.primary = params.primary;
        this.secondary = params.secondary;
    }

    public async build(): Promise<void> {
        const spinner = ora();

        const message = "Building connection system...";
        spinner.start(message);
        // Build the connection between primary and secondary systems.
        await new Promise<void>(resolve => {
            setTimeout(resolve, 3000);
        });

        spinner.succeed(`${message} done.`);
    }

    public async deploy(): Promise<void> {
        const spinner = ora();

        const message = "Deploying connection system...";
        spinner.start(message);
        // Deploy the connection between primary and secondary systems.
        await new Promise<void>(resolve => {
            setTimeout(resolve, 3000);
        });

        spinner.succeed(`${message} done.`);
    }
}

export const createConnectionSystem = (params: IConnectionSystemParams): IConnectionSystem => {
    return new ConnectionSystem(params);
};
