import { ZeroPackagesWatcher } from "./ZeroPackagesWatcher";
import { SinglePackageWatcher } from "./SinglePackageWatcher";
import { MultiplePackagesWatcher } from "./MultiplePackagesWatcher";
import { BasePackagesWatcher } from "./BasePackagesWatcher";

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

    private getWatcherClass() {
        const packagesCount = this.packages.length;
        if (packagesCount === 0) {
            return ZeroPackagesWatcher;
        }

        if (packagesCount === 1) {
            return SinglePackageWatcher;
        }

        return MultiplePackagesWatcher;
    }
}
