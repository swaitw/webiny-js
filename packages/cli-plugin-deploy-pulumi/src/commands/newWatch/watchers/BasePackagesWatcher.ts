import { Context, IUserCommandInput } from "~/types";

export interface IBasePackagesWatcherPackage {
    name: string;
    paths: {
        root: string;
        config: string;
    };
}

export interface IBasePackagesWatcherParams {
    packages: IBasePackagesWatcherPackage[];
    inputs: IUserCommandInput;
    context: Context;
}

export class BasePackagesWatcher {
    public readonly packages: IBasePackagesWatcherPackage[];
    public readonly inputs: IUserCommandInput;
    public readonly context: Context;

    public constructor({ packages, inputs, context }: IBasePackagesWatcherParams) {
        this.packages = packages;
        this.inputs = inputs;
        this.context = context;
    }

    public async watch(): Promise<void> {
        throw new Error("Not implemented.");
    }
}
