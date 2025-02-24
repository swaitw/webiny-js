import execa from "execa";
import semver from "semver";
import { IBasicPackage, IVersionedPackage } from "./types";

export interface IGetUpdatableParams {
    packages: IBasicPackage[];
}

export class LatestVersionPackages {
    private readonly cache: WeakMap<IBasicPackage[], IVersionedPackage[]> = new WeakMap();

    public async getUpdatable(params: IGetUpdatableParams): Promise<IVersionedPackage[]> {
        const cache = this.cache.get(params.packages);
        if (cache) {
            return cache;
        }

        const results: IVersionedPackage[] = [];
        await Promise.allSettled(
            params.packages.map(async pkg => {
                try {
                    const result = await execa("npm", ["show", pkg.name, "version"]);
                    if (!result.stdout) {
                        console.log(`Could not find "${pkg.name}" latest version on npm.`);
                        return;
                    }
                    const npmPackageVersion = semver.coerce(result.stdout);
                    if (!npmPackageVersion) {
                        console.log(
                            `Could not coerce "${pkg.name}" latest version "${result.stdout}" from npm.`
                        );
                        return;
                    }
                    if (semver.gte(pkg.version, npmPackageVersion)) {
                        return;
                    }

                    results.push({
                        ...pkg,
                        latestVersion: npmPackageVersion
                    });
                } catch (ex) {
                    console.error(`Could not find "${pkg.name}" latest version on npm.`, ex);
                }
            })
        );

        this.cache.set(params.packages, results);
        return results;
    }

    public static async create() {
        return new LatestVersionPackages();
    }
}
