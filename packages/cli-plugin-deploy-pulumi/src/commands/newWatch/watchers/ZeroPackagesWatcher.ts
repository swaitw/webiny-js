import { BasePackagesWatcher } from "./BasePackagesWatcher";

export class ZeroPackagesWatcher extends BasePackagesWatcher {
    public override async watch(): Promise<void> {
        // Simply don't do anything. There are no packages to watch.
        return;
    }
}
