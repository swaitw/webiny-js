import { BasePackagesBuilder } from "./BasePackagesBuilder";
import { gray } from "chalk";
import { IRequireConfigOptions, requireConfigWithExecute } from "~/utils";

export class SinglePackageBuilder extends BasePackagesBuilder {
    public override async build() {
        const pkg = this.packages[0];
        const context = this.context;
        const inputs = this.inputs;

        const { env, debug, variant, region } = inputs;

        const pkgName = pkg.name;
        const pkgRelativePath = gray(`(${pkg.paths.relative})`);
        context.info(`Building %s package...`, `${pkgName} ${pkgRelativePath}`);

        const options: IRequireConfigOptions = {
            env,
            variant,
            region,
            debug,
            cwd: pkg.paths.root,
            // Not much sense in turning off logs when a single package is being built.
            logs: true
        };

        const config = requireConfigWithExecute(pkg.paths.config, {
            options,
            context
        });

        const hasBuildCommand = config.commands && typeof config.commands.build === "function";
        if (!hasBuildCommand) {
            throw new Error("Build command not found.");
        }

        await config.commands.build(options);
    }
}
