import { BasePackagesBuilder } from "./BasePackagesBuilder";
import { ZeroPackagesBuilder } from "./ZeroPackagesBuilder";
import { SinglePackageBuilder } from "./SinglePackageBuilder";
import { MultiplePackagesBuilder } from "./MultiplePackagesBuilder";

export class PackagesBuilder extends BasePackagesBuilder {
    public override async build(): Promise<void> {
        const BuilderClass = this.getBuilderClass();

        const builder = new BuilderClass({
            packages: this.packages,
            inputs: this.inputs,
            context: this.context
        });

        await builder.build();
    }

    private getBuilderClass() {
        const packagesCount = this.packages.length;
        if (packagesCount === 0) {
            return ZeroPackagesBuilder;
        }

        if (packagesCount === 1) {
            return SinglePackageBuilder;
        }

        return MultiplePackagesBuilder;
    }
}
