import { BasePackagesBuilder } from "./BasePackagesBuilder";

export class ZeroPackagesBuilder extends BasePackagesBuilder {
    public override async build(): Promise<void> {
        // Simply don't do anything. There are no packages to build.
        this.context.info(`No packages to build.`);
    }
}
