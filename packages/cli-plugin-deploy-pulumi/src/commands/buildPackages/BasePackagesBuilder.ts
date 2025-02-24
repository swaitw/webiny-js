import { Context, IUserCommandInput } from "~/types";
import { IProjectApplicationPackage } from "@webiny/cli/types";

export interface IBasePackagesBuilderParams {
    packages: IProjectApplicationPackage[];
    inputs: IUserCommandInput;
    context: Context;
}

export class BasePackagesBuilder {
    public packages: IProjectApplicationPackage[];
    public inputs: IUserCommandInput;
    public context: Context;

    constructor({ packages, inputs, context }: IBasePackagesBuilderParams) {
        this.packages = packages;
        this.inputs = inputs;
        this.context = context;
    }

    public async build() {
        throw new Error("Not implemented.");
    }
}
