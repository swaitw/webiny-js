import { BasePackagesWatcher } from "./BasePackagesWatcher";
import { NoDeploymentsPackagesWatcher } from "./NoDeploymentsPackagesWatcher/NoDeploymentsPackagesWatcher";

export class PackagesWatcher extends BasePackagesWatcher {
    public override async watch(): Promise<void> {
        const WatcherClass = this.getWatcherClass();

        const watcher = new WatcherClass({
            packages: this.packages,
            inputs: this.inputs,
            context: this.context
        });

        await watcher.watch();
    }

    public getWatcherClass() {
        return NoDeploymentsPackagesWatcher;
    }
}
