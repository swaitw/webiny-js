import glob from "glob";

const defaultIgnore = ["**/node_modules/**", "**/dist/**", "**/build/**"];

export interface IListAllPackageJsonFilesListParams {
    targets: string[];
    ignore?: string[];
}

export class ListAllPackageJsonFiles {
    public list(params: IListAllPackageJsonFilesListParams): string[] {
        const targets = params.targets;
        const ignore = defaultIgnore.concat(params.ignore || []);

        const results: string[] = [];

        for (const target of targets) {
            const files = glob.sync(`${target}/**/**/package.json`, {
                ignore
            });
            results.push(...files);
            /**
             * Some of our packages have files named `dependencies.json` which contain a list of dependencies.
             */
            const dependencies = glob.sync(`${target}/**/**/dependencies.json`, {
                ignore
            });
            results.push(...dependencies);
        }

        return results;
    }
}
