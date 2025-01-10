import { PackageJson as BasePackageJson } from "type-fest";
import { SemVer } from "semver";

export interface IBasicPackage {
    name: string;
    version: SemVer;
}

export interface IVersionedPackage extends IBasicPackage {
    latestVersion: SemVer;
}

export interface IPackageJson extends BasePackageJson {
    resolutions: Record<string, string>;
}
