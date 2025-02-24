import path from "path";
import { CliContext } from "@webiny/cli/types";
import { IDependencyTree } from "~/types";
import { ListAllPackages } from "~/references/ListAllPackages";
import { ListAllPackageJsonFiles } from "./ListAllPackageJsonFiles";
import { BuildDependencyTree } from "./BuildDependencyTree";

export interface IListAllReferencesParams {
    context: CliContext;
    dirname: string;
}

export const createDependencyTree = (params: IListAllReferencesParams): IDependencyTree => {
    const { context } = params;
    const basePath = context.project.root;
    const target = path.join(basePath, "packages");

    const listAllPackages = new ListAllPackages();
    const listAllPackageJsonFiles = new ListAllPackageJsonFiles();
    const buildDependencyTree = new BuildDependencyTree();

    const allPackages = listAllPackages.list(target);

    const allPackageJsonFiles = listAllPackageJsonFiles.list({
        targets: allPackages
    });

    const files = [path.join(basePath, "package.json"), ...allPackageJsonFiles];

    return buildDependencyTree.build({
        basePath,
        files,
        ignore: /^@webiny\//
    });
};
