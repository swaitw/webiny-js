import { BasePackagesWatcher } from "../BasePackagesWatcher";
import { NoDeploymentsZeroPackagesWatcher } from "./NoDeploymentsZeroPackagesWatcher";
import { NoDeploymentsSinglePackageWatcher } from "./NoDeploymentsSinglePackageWatcher";
import { NoDeploymentsMultiplePackagesWatcher } from "./NoDeploymentsMultiplePackagesWatcher";

export class NoDeploymentsPackagesWatcher extends BasePackagesWatcher {
    public override async watch(): Promise<void> {
        const WatcherClass = this.getWatcherClass();

        const watcher = new WatcherClass({
            packages: this.packages,
            inputs: this.inputs,
            context: this.context
        });

        await watcher.watch();
    }

    private getWatcherClass() {
        const packagesCount = this.packages.length;
        if (packagesCount === 0) {
            return NoDeploymentsZeroPackagesWatcher;
        }

        if (packagesCount === 1) {
            return NoDeploymentsSinglePackageWatcher;
        }

        return NoDeploymentsMultiplePackagesWatcher;
    }
}
