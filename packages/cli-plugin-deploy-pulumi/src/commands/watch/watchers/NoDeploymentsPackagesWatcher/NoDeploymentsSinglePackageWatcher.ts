import { BasePackagesWatcher } from "./../BasePackagesWatcher";
import { requireConfigWithExecute } from "~/utils";

export class NoDeploymentsSinglePackageWatcher extends BasePackagesWatcher {
    public override async watch(): Promise<void> {
        const pkg = this.packages[0];
        const context = this.context;
        const inputs = this.inputs;

        const { env, variant, region, debug } = inputs;

        const options = {
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

        const hasWatchCommand = config.commands && typeof config.commands.watch === "function";
        if (!hasWatchCommand) {
            throw new Error("Watch command not found.");
        }

        await config.commands.watch(options, context);
    }
}
