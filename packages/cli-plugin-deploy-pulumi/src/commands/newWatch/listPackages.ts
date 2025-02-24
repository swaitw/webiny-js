import execa from "execa";
import fs from "fs";
import path from "path";
import { requireConfig } from "~/utils";
import { IUserCommandInput } from "~/types";

export interface IListPackagesParams {
    inputs: Pick<IUserCommandInput, "package" | "depth" | "folder" | "env">;
}

export interface IListPackagesPackage {
    name: string;
    config: any;
    paths: {
        root: string;
        config: string;
    };
}

export const listPackages = async ({ inputs }: IListPackagesParams) => {
    let packagesList: string[] = [];
    if (inputs.package) {
        packagesList = Array.isArray(inputs.package) ? [...inputs.package] : [inputs.package];

        // When providing packages manually, we also allow providing names of Webiny packages
        // without the `@webiny` scope. In that case, we need to add the scope to the package name.
        const webinyPrefixedPackagesToAdd = [];
        for (let i = 0; i < packagesList.length; i++) {
            if (!packagesList[i].startsWith("@webiny")) {
                webinyPrefixedPackagesToAdd.push(`@webiny/${packagesList[i]}`);
            }
        }

        packagesList.push(...webinyPrefixedPackagesToAdd);
    } else {
        const cmd: string[] = [
            "webiny",
            "workspaces",
            "tree",
            "--json",
            "--depth",
            String(inputs.depth || ""),
            "--distinct",
            "--folder",
            inputs.folder
        ];
        packagesList = await execa("yarn", cmd).then(({ stdout }) => {
            return JSON.parse(stdout);
        });
    }

    const commandArgs = [
        "webiny",
        "workspaces",
        "list",
        "--json",
        "--withPath",
        ...packagesList.reduce<string[]>((current, item) => {
            current.push("--scope", item);
            return current;
        }, [])
    ];

    if (inputs.env) {
        commandArgs.push("--env", inputs.env);
    }

    return execa("yarn", commandArgs).then(({ stdout }) => {
        const result = JSON.parse(stdout);
        const packages: IListPackagesPackage[] = [];
        for (const packageName in result) {
            const root = result[packageName];
            const configPath = fs.existsSync(path.join(root, "webiny.config.ts"))
                ? path.join(root, "webiny.config.ts")
                : path.join(root, "webiny.config.js");

            // We need this because newly introduced extension
            // packages do not have a Webiny config file.
            if (!fs.existsSync(configPath)) {
                continue;
            }

            const config = requireConfig(configPath);

            packages.push({
                name: packageName,
                config,
                paths: {
                    root,
                    config: configPath
                }
            });
        }

        return packages;
    });
};
